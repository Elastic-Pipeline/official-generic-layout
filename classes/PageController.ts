import { NextFunction, Request, Response } from "express";
import { RouteManager, URI, URL } from "../../../API/Routing/RouteManager";
import { RouteType, ROUTE_FIRST } from "../../../API/Routing/Routing";

//  Page Controller will allow developers to add elements, and sub-pages to a page.
export abstract class Page
{
    private uri: URI;
    private url: URL;
    protected icon: string|undefined;
    protected hide: boolean = false;
    protected routing: boolean = true;
    protected subPages: Page[] = new Array();

    private name: string;

    constructor(_name: string, _url: URL, _uri: URI, _hide: boolean = false, _routing: boolean = true)
    {
        this.name = _name;
        this.url = _url.startsWith('/') ? _url.substr(0) : _url;
        this.uri = _uri;
        this.hide = _hide;
        this.routing = this.routing;
    }

    public RouteFunction(req: Request, res: Response, next: NextFunction) : Promise<any> {
        return new Promise<void>(
            (resolve, reject) => {
                if (this.routing)
                    reject("Route Function isn't setup for " + this.constructor.name);
            }
        );
    }


    public Init(_internal: PageControllerInternal) : void
    {
        if (!this.routing)
            return;

        // Setup the route.
        RouteManager.AddRoute(RouteType.GET, this.url, this.GetURI(), this.RouteFunction, ROUTE_FIRST);
    }

    public GetIcon() : string
    {
        if (this.icon == undefined)
            return '';
        return `<i class='${this.icon}' aria-hidden='true'></i>`;
    }

    public GetName() : string
    {
        return this.name;
    }

    public GetURI() : string
    {
        return "pages/" + this.uri;
    }

    public GetHidden() : boolean
    {
        return this.hide;
    }

    public GetSubPages() : Page[]
    {
        return this.subPages;
    }

    public AddSubPage(_page: Page, _insert: number = -1) : void
    {
        if (_insert == -1)
            this.subPages.push(_page);
        else
            this.subPages.splice(_insert, 0, _page);

        console.log(this.GetName(), "<-", _page.GetName());

        _page.url = this.url + '/' + _page.url;
        _page.uri = this.uri + '/' + _page.uri;

        PageController.RegisterPage(_page, _insert);
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
    public RegisterPage(_page: Page, _insert: number = -1)
    {
        if (_insert == -1)
        {
            this.pages.push(_page);
        }
        else
        {
            // Insert.
            this.pages.splice(_insert, 0, _page);
        }
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
    public static RegisterPage(_page: Page, _insert: number = -1)
    {
        this.internal.RegisterPage(_page, _insert);
    }
}
