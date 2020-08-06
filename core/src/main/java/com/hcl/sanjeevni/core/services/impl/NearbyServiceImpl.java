package com.hcl.sanjeevni.core.services.impl;

import com.hcl.sanjeevni.core.config.NearbyServiceConfig;
import com.hcl.sanjeevni.core.constants.CoreConstants;
import com.hcl.sanjeevni.core.services.NearbyService;
import com.hcl.sanjeevni.core.utility.Utility;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = NearbyService.class, immediate = true)
public class NearbyServiceImpl implements NearbyService {

    private static final Logger LOG = LoggerFactory.getLogger(NearbyServiceImpl.class);
    String responseStream = null;

    @Activate
    NearbyServiceConfig config;

    @Override
    public String getUsername() {
        return config.nearbyService_userName();
    }

    @Override
    public String getApiPath() {
        return config.nearbyService_apiPath();
    }

    @Override
    public String getPassword() {
        return config.nearbyService_password();
    }

    @Override
    public String getHospitalDetails(String longitude, String latitude) {
        String url = getApiPath()+"GetNearbyHospitals/"+getUsername()+","+getPassword()+","+ longitude+","+latitude+"/";
        LOG.info("URL formed for Nearby Hospitals : "+url);

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

        return responseStream;
    }

    @Override
    public String getPoliceStationDetails(String longitude, String latitude) {
        String url = getApiPath()+"GetNearbyPoliceStation/"+getUsername()+","+getPassword()+","+ longitude+","+latitude+"/";
        LOG.info("URL formed for Nearby Police Stations : "+url);

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
            LOG.error(" getPoliceStationDetails method caught an exception : " + e.getMessage());
            e.printStackTrace();
        }

        return responseStream;
    }

}
