package com.hcl.sanjeevni.core.config;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Nearby Service API Configuration")
public @interface NearbyServiceConfig {

    String API_PATH = "http://stg1.ksrsac.in/nearbyservices/webapi/";
    String USERNAME = "a2e44ed3522d786d63a31711844747da1d5792f30413545f8a282c85894b0c54";
    String PASSWORD = "5542131876bb7eb0f68c887164c3b92de0901acbb7f8c4169e1286880cf9ce75";

    @AttributeDefinition(name = "API PATH", type = AttributeType.STRING)
    String nearbyService_apiPath() default API_PATH;

    @AttributeDefinition(name = "Username", type = AttributeType.STRING)
    String nearbyService_userName() default USERNAME;

    @AttributeDefinition(name = "Password", type = AttributeType.PASSWORD)
    String nearbyService_password() default PASSWORD;
}
