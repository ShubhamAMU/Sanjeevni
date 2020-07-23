package com.hcl.sanjeevni.core.utility;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class Utility {

    public static JsonArray fromStringToJsonArray(String responseStream) {

        JsonArray j_array;
        JsonObject jobj = new Gson().fromJson(responseStream, JsonObject.class);
        if (jobj.has("results")) {
            j_array = jobj.getAsJsonArray("results");
        } else {
            j_array = jobj.getAsJsonArray();
        }
        return j_array;
    }
}
