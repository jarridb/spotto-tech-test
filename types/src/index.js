// Enums
export var Provider;
(function (Provider) {
    Provider["Azure"] = "Azure";
    Provider["AWS"] = "AWS";
    Provider["GCP"] = "GCP";
})(Provider || (Provider = {}));
export var ResourceType;
(function (ResourceType) {
    ResourceType["VirtualMachine"] = "Virtual Machine";
    ResourceType["SQLDatabase"] = "SQL Database";
    ResourceType["StorageAccount"] = "Storage Account";
    ResourceType["CDN"] = "CDN";
    ResourceType["PostgreSQLDatabase"] = "PostgreSQL Database";
    ResourceType["RedisCache"] = "Redis Cache";
    ResourceType["MongoDBDatabase"] = "MongoDB Database";
    ResourceType["MySQLDatabase"] = "MySQL Database";
})(ResourceType || (ResourceType = {}));
export var Environment;
(function (Environment) {
    Environment["Production"] = "Production";
    Environment["Staging"] = "Staging";
    Environment["Development"] = "Development";
    Environment["Testing"] = "Testing";
})(Environment || (Environment = {}));
export var BusinessUnit;
(function (BusinessUnit) {
    BusinessUnit["Engineering"] = "Engineering";
    BusinessUnit["Sales"] = "Sales";
    BusinessUnit["Marketing"] = "Marketing";
    BusinessUnit["Finance"] = "Finance";
    BusinessUnit["Operations"] = "Operations";
})(BusinessUnit || (BusinessUnit = {}));
