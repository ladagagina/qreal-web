﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Android_Generator_v2
{
    interface ManifestBuilderInterface
    {
        String build();
        void setPackage(String package);
        void addPermission(String permission);
        void addActivity(String activity);
        void addFeature(String feature);
    }
}
