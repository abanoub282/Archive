export interface MainData {
    query?:    Allsale[];
    allsales?: Allsale[];
    offerdetailsarray?: { [key: string]: number };

}

export interface Allsale {
    SumTotal?:   number;
    TaxesTotal?:   number;
    DiscountTotal?:   number;

    ServiceTotal?:   number;

    id?:         number;
    orderID?:    number;
    itemID?:     number;
    itemamount?: number;
    itemtotal?:  number;
    created?:    string;
    modified?:   string;
    item?:       Item;

}

export interface Item {
    id?:            number;
    name?:          string;
    taxID?:         number;
    price?:         number;
    subcategoryID?: number;
    created?:       string;
    modified?:      string;
    photo?:         string;
    subcategory?:   Subcategory;
}

export interface Subcategory {
    id?:         number;
    name?:       string;
    categoryID?: number;
    created?:    string;
    modified?:   string;
    category?:   Category;
}

export interface Category {
    id?:       number;
    name?:     string;
    created?:  null | string;
    modified?: null | string;
    type?:     string;
}
