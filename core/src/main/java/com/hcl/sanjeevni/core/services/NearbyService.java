package com.hcl.sanjeevni.core.services;

public interface NearbyService {

    public String getHospitalDetails(String longitude, String latitude);

    public String getPoliceStationDetails(String longitude, String latitude);

    public String getUsername();

    public String getApiPath();

    public String getPassword();
}

