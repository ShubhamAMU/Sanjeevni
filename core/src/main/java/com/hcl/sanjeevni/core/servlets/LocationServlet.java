package com.hcl.sanjeevni.core.servlets;

import com.google.gson.JsonArray;
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
            LOG.info("Location Response : " + responseStream.toString());
            response.setContentType(CoreConstants.APPLICATION_JSON);
            response.getWriter().write(responseStream.toString());
        } else{
            address = "No address found";
            response.getWriter().write(address);
        }

    }
}
