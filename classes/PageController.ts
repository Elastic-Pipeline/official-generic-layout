import { NextFunction, Request, Response } from "express";
import { RouteManager, URI, URL } from "../../../API/Routing/RouteManager";
import { RouteType, ROUTE_FIRST } from "../../../API/Routing/Routing";

//  Page Controller will allow developers to add elements, and sub-pages to a page. 
export abstract class Page
{
    private uri: URI; 
    private url: URL; 
    protected hide: boolean = false;
    private subPages: Page[] = new Array();
    constructor(_uri: URI, _url: URL, _hide: boolean = false)
    {
        this.uri = _uri;
        this.url = _url;
        this.hide = _hide;
    }

    public abstract RouteFunction(req: Request, res: Response, next: NextFunction) : void;

    public Init(_internal: PageControllerInternal) : void
    {
        // Setup the route.
        RouteManager.AddRoute(RouteType.GET, '/' + this.url, this.uri, this.RouteFunction, ROUTE_FIRST, true);

        // Tell Internal Page to add this page.
        for (let index = 0; index < this.subPages.length; index++) {
            const page = this.subPages[index];
            _internal.RegisterPage(page);
        }
    }

    public GetHidden() : boolean
    {
        return this.hide;
    }

    protected AddSubPage(_page: Page) : void
    {
        this.subPages.push(_page);
    }
}

export class PageControllerInternal
{
    private pages: Page[] = new Array();
    
    public GetPages(): Page[] 
    {
        return this.pages;
    }
    // When a Page is registered, it is treated like the root here.
    //  Root doesn't necessary become `/`
    //  Root is located where generic page home page is located.
    public RegisterPage(_page: Page)
    {
        this.pages.push(_page);
        _page.Init(this);
    }
}

export class PageController
{
    private static internal: PageControllerInternal = new PageControllerInternal();

    public static GetPages(): Page[]
    {
        return this.internal.GetPages();
    }

    // When a Page is registered, it is treated like the root here.
    //  Root doesn't necessary become `/`
    //  Root is located where generic page home page is located.
    public static RegisterPage(_page: Page)
    {
        this.internal.RegisterPage(_page);
    }
}
