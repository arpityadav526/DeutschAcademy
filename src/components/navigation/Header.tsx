"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
export function Header() {
  const pathname=usePathname(); const [open,setOpen]=useState(false);
  const items=[{href:"/learn/a1/unit-01",label:"Lektion"},{href:"/grammar",label:"Nachschlagewerk"},{href:"/review",label:"Abfahrt"},{href:"/writing",label:"Postkarte"},{href:"/dashboard",label:"Reiseplan"},{href:"/reisepass",label:"Reisepass"}];
  const active=(href:string)=>href==="/learn/a1/unit-01"?pathname.startsWith("/learn"):pathname.startsWith(href);
  return <header className="journey-header sticky top-0 z-40"><div className="flag-stripe" aria-hidden="true"><i/><i/><i/></div><div className="header-inner"><Link href="/" className="brand"><span className="font-fraktur">DeutschAcademy</span><small>HAMBURG HBF · ZUGSPITZE</small></Link><nav className="desktop-wayfinding">{items.map(item=><Link key={item.href} href={item.href} className={active(item.href)?"wayfinding-link current":"wayfinding-link"}>{item.label}<span>{active(item.href)?"←":"→"}</span></Link>)}</nav><Link href="/learn/a1/unit-01" className="header-ticket">Weiterlernen →</Link><button className="mobile-trigger" type="button" onClick={()=>setOpen(!open)} aria-label={open?"Menü schließen":"Menü öffnen"}>{open?<X/>:<Menu/>}</button></div>{open&&<nav className="mobile-wayfinding">{items.map(item=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)}>{item.label}<span>→</span></Link>)}</nav>}</header>;
}
