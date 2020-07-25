package com.hcl.sanjeevni.core.models;


import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = Resource.class)
public class Multifield {
    private static final Logger LOGGER = LoggerFactory.getLogger(Multifield.class);

    @Inject
    @Optional
    public Resource products;

}
