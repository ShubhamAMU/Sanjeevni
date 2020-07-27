package com.hcl.sanjeevni.core.servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.hcl.sanjeevni.core.constants.CoreConstants;
import com.hcl.sanjeevni.core.services.LocationService;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Component(service = Servlet.class,
        property = {
                "sling.servlet.paths=/bin/hclcovid19/location",
                "sling.servlet.methods = " + HttpConstants.METHOD_GET,
        }
)
public class LocationServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(LocationServlet.class);

    @Reference
    LocationService locationService;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {

        LOG.debug("Inside  LocationServlet doGet Method");

        String address = request.getParameter("address");
        if (StringUtils.isNotEmpty(address)){
            JsonArray responseStream = locationService.getLocationDetails(address);
            JsonObject locationResponse = responseStream.getAsJsonArray().get(0).getAsJsonObject();
            LOG.info("Location Response : " + locationResponse.toString());
            List<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
            HashMap<String, String> productMap = new HashMap<String, String>();

            String formattedAddress = Objects.nonNull(locationResponse.get("formatted_address")) ? locationResponse.get("formatted_address").getAsString() : "";
            String placeId = Objects.nonNull(locationResponse.get("place_id")) ? locationResponse.get("place_id").getAsString() : "";
            String longitude = Objects.nonNull(locationResponse.get("geometry")) ? locationResponse.get("geometry").getAsJsonObject().get("location").getAsJsonObject().get("lng").getAsString() : "";
            String latitude = Objects.nonNull(locationResponse.get("geometry")) ? locationResponse.get("geometry").getAsJsonObject().get("location").getAsJsonObject().get("lat").getAsString() : "";

            productMap.put("formatted_address", formattedAddress);
            productMap.put("place_id", placeId);
            productMap.put("latitude", latitude);
            productMap.put("longitude", longitude);
            list.add(productMap);
            LOG.info("Array list is {}",list.toString());
            response.setContentType(CoreConstants.APPLICATION_JSON);
            response.getWriter().write(list.toString());
        } else{
            address = "No address found";
            response.getWriter().write(address);
        }

    }
}
