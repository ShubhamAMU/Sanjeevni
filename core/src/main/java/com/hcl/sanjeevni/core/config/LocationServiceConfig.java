package com.hcl.sanjeevni.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Location API Service Configuration")
public @interface LocationServiceConfig {

    @AttributeDefinition(name = "Location API Path", type = AttributeType.STRING)
    String locationService_apiPath() default "https://maps.googleapis.com/maps/api/geocode/json";

    @AttributeDefinition(name = "API Key", type = AttributeType.STRING)
    String locationService_apiKey() default "AIzaSyCZuiZMLzQ4wcmlu4JlVK-RoX3QTADLVbI";
}
