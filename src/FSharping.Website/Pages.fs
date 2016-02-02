﻿module FSharping.Website.Pages

open Suave
open Shaver.Razor

let home : WebPart =
    let blogposts = Blog.getPosts |> Seq.toList
    let meetups = Meetups.getMeetups |> Seq.toList
    [
        ("Menu", partial "views/menu.html" "home");
        ("Content", 
            [("LeftCol",
                [("Blog", partial "views/main/leftColBlog.html" blogposts);
                 ("Meetups", partial "views/main/leftColMeetups.html" meetups)
                ] |> nested "views/main/leftCol.html" null);
        
            ] |> nested "views/main/index.html" null);
    ] |> masterPage "views/layout.html" null

let error404 : WebPart =
    [
        ("Menu", partial "views/menu.html" "home");
        ("Content", partial "views/404.html" null);
    ] |> masterPageWithCode HTTP_404 "views/layout.html" null

let private makeTitle txt = sprintf "%s - " txt

let private title key = 
    match Shaver.Resources.getValue "Texts" key <| Some(System.Globalization.CultureInfo.CurrentCulture) with
    | Some(txt) -> makeTitle txt
    | None -> ""

module Meetups =
    
    let rss =
        let meetups = Meetups.getMeetups |> Seq.rev |> Seq.toList
        singlePage "views/meetups/rss.html" meetups

    let index = 
        let meetups = Meetups.getMeetups |> Seq.toList
        [
            ("Menu", partial "views/menu.html" "meetups");
            ("Content", partial "views/meetups/index.html" meetups);
        ] |> masterPage "views/layout.html" (title "Meetups")

module Blog =
    
    let rss =
        let posts = Blog.getPosts |> Seq.rev |> Seq.toList
        singlePage "views/blog/rss.html" posts

    let index =
        let posts = Blog.getPosts |> Seq.toList
        [
            ("Menu", partial "views/menu.html" "blog");
            ("Content", partial "views/blog/index.html" posts);
        ] |> masterPage "views/layout.html" (title "Blog")

    let detail rewrite = warbler (fun _ ->
        let post = Blog.getPosts |> Seq.find (fun x -> x.Rewrite = rewrite)
        [
            ("Menu", partial "views/menu.html" "blog");
            ("Content", partial "views/blog/detail.html" post);
        ] |> masterPage "views/layout.html" (makeTitle post.Title)
    )