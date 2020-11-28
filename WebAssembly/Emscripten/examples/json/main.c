#include <stdio.h>
#include "cJSON/cJSON.h"

int main()
{
    const char jsonstr[] = "{\"data\":\"Hello World!\"}";
    cJSON *json = cJSON_Parse(jsonstr);

    const cJSON *data = cJSON_GetObjectItem(json, "data");
    printf("%s\n", cJSON_GetStringValue(data));

    cJSON_Delete(json);
    return 0;
}