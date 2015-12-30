// include Fake lib
#I "packages/FAKE/tools/"
#r "FakeLib.dll"

open System
open System.IO
open Fake 
open Fake.AssemblyInfoFile

RestorePackages()

// Directories
let buildAppDir = "./build/app/"
let buildTestDir = "./build/tests/"
let appSrcDir = "./src/FSharping.Website/"
let testSrcDir = "./tests/FSharping.Website.Tests/"

// Read release notes & version info from RELEASE_NOTES.md
let release = File.ReadLines "RELEASE_NOTES.md" |> ReleaseNotesHelper.parseReleaseNotes

let title = "FSharping Website"
let project = "FSharping Website"
let summary = "Website source for fsharping.cz"

// Targets
Target "?" (fun _ ->
    printfn " *********************************************************"
    printfn " *        Avaliable options (call 'build <Target>')      *"
    printfn " *********************************************************"
    printfn " [Build]"
    printfn "  > BuildApp"
    printfn "  > BuildTests"
    printfn "  > BuildWithTests"
    printfn " "
    printfn " [Help]"
    printfn "  > ?"
    printfn " "
    printfn " *********************************************************"
)

Target "AssemblyInfo" <| fun () ->
    for file in !! (appSrcDir + "AssemblyInfo*.fs") do
        let version = release.AssemblyVersion
        CreateFSharpAssemblyInfo file
           [ Attribute.Title title
             Attribute.Product project
             Attribute.Description summary
             Attribute.Version version
             Attribute.FileVersion version]

Target "CleanApp" (fun _ ->
    CleanDir buildAppDir
)

Target "CleanTests" (fun _ ->
    CleanDir buildAppDir
)

Target "BuildWww" (fun _ ->
    let gulp = tryFindFileOnPath (if isUnix then "gulp" else "gulp.cmd")
    let errorCode = match gulp with
                      | Some g -> Shell.Exec(g, "compile --release", appSrcDir)
                      | None -> -1
    ()
)

Target "BuildApp" (fun _ ->
   !! (appSrcDir + "**/*.fsproj")
     |> MSBuildRelease buildAppDir "Build"
     |> Log "AppBuild-Output: "
)

Target "BuildTests" (fun _ ->
    !! (testSrcDir + "**/*.fsproj")
      |> MSBuildDebug buildTestDir "Build"
      |> Log "TestBuild-Output: "
)

Target "BuildWithTests" (fun _ ->
    !! (buildTestDir + "/FSharping.Website.Tests.dll")
      |> NUnit (fun p ->
          {p with
             DisableShadowCopy = true;
             OutputFile = buildTestDir + "TestResults.xml" })
)


// Dependencies
"CleanApp" ==> "AssemblyInfo" ==>  "BuildApp"
"CleanTests" ==> "BuildTests"
"BuildApp"  ==> "BuildTests"  ==> "BuildWithTests"

// start build
RunTargetOrDefault "?"