package com.hcl.sanjeevni.core.utility;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class Utility {

    private static final Logger LOG = LoggerFactory.getLogger(Utility.class);

    public static JsonArray fromStringToJsonArray(String responseStream) {

        JsonArray j_array = new JsonArray();
        JsonObject jobj = new Gson().fromJson(responseStream, JsonObject.class);
        if(jobj.get("status").getAsString().equals("OK")){
            j_array = jobj.getAsJsonArray("results");
        } else {
            j_array.add("No Results found");
        }
        return j_array;
    }

    public static String encodeValue(String address){
        String encodedAddress = address;
        try {
            encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8.toString());
            return encodedAddress;
        } catch (UnsupportedEncodingException e) {
            LOG.error("Failed to encode the address : " + address +  e.getMessage());
            e.printStackTrace();
        }
        return encodedAddress;
    }
}
