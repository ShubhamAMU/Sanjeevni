package com.hcl.sanjeevni.core.services;

import com.google.gson.JsonArray;

public interface LocationService {

    public JsonArray getLocationDetails(String address);

    public String getApiPath();

    public String getApiKey();

    public String getLatitude(JsonArray locationResponse);

    public String getLongitude(JsonArray locationResponse);
}
