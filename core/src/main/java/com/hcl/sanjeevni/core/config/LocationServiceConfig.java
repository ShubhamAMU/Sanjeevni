package com.hcl.sanjeevni.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Location API Service Configuration")
public @interface LocationServiceConfig {

    String API_PATH = "https://maps.googleapis.com/maps/api/geocode/json";
    String API_KEY = "AIzaSyCZuiZMLzQ4wcmlu4JlVK-RoX3QTADLVbI";

    @AttributeDefinition(name = "Location API Path", type = AttributeType.STRING)
    String locationService_apiPath() default API_PATH;

    @AttributeDefinition(name = "API Key", type = AttributeType.STRING)
    String locationService_apiKey() default API_KEY;
}
