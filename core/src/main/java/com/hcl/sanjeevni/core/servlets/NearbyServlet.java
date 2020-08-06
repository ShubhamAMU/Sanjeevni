package com.hcl.sanjeevni.core.servlets;

import com.google.gson.JsonArray;
import com.hcl.sanjeevni.core.services.LocationService;
import com.hcl.sanjeevni.core.services.NearbyService;
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

@Component(service = Servlet.class,
            property = {
                    "sling.servlet.paths=/bin/hclcovid19/nearbyservice",
                    "sling.servlet.methods = "+ HttpConstants.METHOD_GET
            }
)
public class NearbyServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(NearbyServlet.class);

    @Reference
    NearbyService nearbyService;

    @Reference
    LocationService locationService;

    String responseStream;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {

        String address = request.getParameter("address");
        String service = request.getParameter("service");
        if(StringUtils.isNotEmpty(address)){
            JsonArray locationArray = locationService.getLocationDetails(address);
            LOG.info("LocationArray : "+locationArray );
            String latitude = locationService.getLatitude(locationArray);
            LOG.info("Latitude : "+latitude);
            String longitude = locationService.getLongitude(locationArray);
            LOG.info("Longitude : "+longitude);

            if("hospital".equals(service))
                responseStream = nearbyService.getHospitalDetails(longitude,latitude);
            else if("police-station".equals(service))
                responseStream = nearbyService.getPoliceStationDetails(longitude,latitude);
            else
                responseStream = "Nothing found nearby";

            LOG.info("Response is "+ responseStream);
            response.getWriter().write(responseStream);
        } else{
            address = "No address found";
            response.getWriter().write(address);
        }

    }
}
