﻿namespace System
open System.Reflection

[<assembly: AssemblyTitleAttribute("FSharping Website")>]
[<assembly: AssemblyProductAttribute("FSharping Website")>]
[<assembly: AssemblyDescriptionAttribute("Website source for fsharping.cz")>]
[<assembly: AssemblyVersionAttribute("1.0.0")>]
[<assembly: AssemblyFileVersionAttribute("1.0.0")>]
do ()

module internal AssemblyVersionInformation =
    let [<Literal>] Version = "1.0.0"
