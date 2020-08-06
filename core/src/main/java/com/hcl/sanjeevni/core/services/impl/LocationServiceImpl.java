package com.hcl.sanjeevni.core.services.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.hcl.sanjeevni.core.config.LocationServiceConfig;
import com.hcl.sanjeevni.core.constants.CoreConstants;
import com.hcl.sanjeevni.core.services.LocationService;
import com.hcl.sanjeevni.core.utility.Utility;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.propertytypes.ServiceVendor;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;

@Component(service = LocationService.class, immediate = true)
@Designate(ocd= LocationServiceConfig.class)
@ServiceVendor("HCL")
public class LocationServiceImpl implements LocationService {

    private static final Logger LOG = LoggerFactory.getLogger(LocationServiceImpl.class);

    @Activate
    private LocationServiceConfig config;

    String responseStream = null;
    JsonArray locationJsonArray = null;

    @Override
    public String getApiPath() {
        return config.locationService_apiPath();
    }

    @Override
    public String getApiKey() {
        return config.locationService_apiKey();
    }

    @Override
    public JsonArray getLocationDetails(String address) {

        String encodedAddress = Utility.encodeValue(address);
        String url = getApiPath() + "?address=" + encodedAddress + "&components=country:IN&key=" + getApiKey();

        LOG.info("URL formed for forward geocoding : " + url);

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(url);
        httpGet.setHeader(CoreConstants.CONTENT_TYPE, CoreConstants.APPLICATION_JSON);
        try {
                CloseableHttpResponse httpResponse = httpClient.execute(httpGet);
                if(httpResponse.getStatusLine().getStatusCode() == CoreConstants.STATUS_CODE_200){
                    responseStream = EntityUtils.toString(httpResponse.getEntity());
                    LOG.info("Location Response Json : " + responseStream);
                } else{
                    responseStream = "Failed to fetch response from API : " + url;
                    LOG.error("Failed to fetch response from API : " + url);
                }
            } catch (Exception e) {
                LOG.error(" getLocationDetails method caught an exception : " + e.getMessage());
                e.printStackTrace();
            }

        locationJsonArray = Utility.fromStringToJsonArray(responseStream);
        LOG.info("Json Array formed : " + locationJsonArray);

        return locationJsonArray;
    }

    @Override
    public String getLatitude(JsonArray locationResponseArray) {
        String latitude = "0.0";
        if(getLocationObject(locationResponseArray) != null)
            latitude = getLocationObject(locationResponseArray).get("lat").getAsString();

        return latitude;
    }

    @Override
    public String getLongitude(JsonArray locationResponseArray) {
        String longitude = "0.0";
        if(getLocationObject(locationResponseArray) != null)
            longitude = getLocationObject(locationResponseArray).get("lng").getAsString();
        return longitude;
    }

    private JsonObject getLocationObject(JsonArray responseArray){
        JsonObject locationObject = null;
        if(responseArray.getAsJsonArray().get(0).isJsonObject()){
            JsonObject locationResponseObject = responseArray.getAsJsonArray().get(0).getAsJsonObject();
            if(Objects.nonNull(locationResponseObject.get("geometry"))){
                locationObject = locationResponseObject.get("geometry").getAsJsonObject().get("location").getAsJsonObject();
            }
        }
        return locationObject;
    }
}
