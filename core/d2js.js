/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */
(function(n,t){function hf(){return!!u.createElement(ku).getContext}function ph(){e=[];e[0]=8;e[1]=9;e[2]=13;e[3]=16;e[4]=17;e[5]=32;e[6]=37;e[7]=38;e[8]=39;e[9]=40;e[10]=48;e[11]=49;e[12]=50;e[13]=51;e[14]=52;e[15]=53;e[16]=54;e[17]=55;e[18]=56;e[19]=57;e[20]=67;e[21]=88;e[22]=90;init();_USE_EXCANVAS||hf()?(_USE_LAYOUTMOUSE&&(et=!0,_USE_MOUSE=!0),_USE_LAYOUTTOUCH&&(et=!0,_USE_TOUCH=!0),_USE_KEY&&(o(u,yo,wc),o(u,po,bc)),_USE_TOUCH&&(o(u,fr,el),o(u,er,ol),o(u,or,sl)),b=u.createElement(du),b.style.cssText=cf,u.body.appendChild(b),start()&&lf()):error()}function wh(){processEvent(13,n.orientation)}function bh(){processEvent(14,0)}function lf(){oi=!1;k()}function kh(){oi=!0}function dh(n){yr=n}function af(){d=frameTime()-(vt-si);d<0&&(d=0);d>frameTime()&&(d=frameTime())}function bt(){while(vt>si&&vt-si<frameTime())vt=ut()}function k(){if(oi){oi=!1;return}si=ut();yr();vt=ut();_USE_REQUESTANIMATIONFRAME?n.requestAnimationFrame?(bt(),n.requestAnimationFrame(k)):n.webkitRequestAnimationFrame?(bt(),n.webkitRequestAnimationFrame(k)):n.mozRequestAnimationFrame?(bt(),n.mozRequestAnimationFrame(k)):n.oRequestAnimationFrame?(bt(),n.oRequestAnimationFrame(k)):n.msRequestAnimationFrame?(bt(),n.msRequestAnimationFrame(k)):(af(),n.setTimeout(k,d)):(af(),n.setTimeout(k,d))}function o(n,t,i){n.addEventListener?n.addEventListener(t,i,!1):n.attachEvent?n.attachEvent(ii+t,i):n[ii+t]=i}function h(n,t,i){n.removeEventListener?n.removeEventListener(t,i,!1):n.detachEvent?n.detachEvent(ii+t,i):n[ii+t]=null}function gh(){_USE_MOUSE&&f!=null&&(h(f,st,kr),h(f,sr,dr),h(f,ri,bf),h(f,ui,kf),h(f,ht,gr))}function vf(){_USE_MOUSE&&(o(f,st,kr),o(f,sr,dr),o(f,ri,bf),o(f,ui,kf),o(f,ht,gr))}function nc(n){f=u.getElementById(n);i=f.getContext(gu);yf();i.textAlign=hr;i.textBaseline=cr;hi=new cu;vf()}function tc(n){hi=n}function ic(){return f}function rc(){return i}function uc(){return hi}function fc(n){return f=n}function ec(n){return i=n}function yf(){yt=!1}function oc(n,t){f.width=n;f.height=t;i.textAlign=hr;i.textBaseline=cr}function pr(){return parseInt(f.width)}function wr(){return parseInt(f.height)}function vi(n){for(var t=0;n;)t+=n.offsetLeft,n=n.offsetParent;return t}function yi(n){for(var t=0;n;)t+=n.offsetTop,n=n.offsetParent;return t}function sc(){if(!!u.documentElement&&u.documentElement.clientWidth>0)return u.documentElement.clientWidth;if(!u.body){if(!!n.innerWidth)return n.innerWidth}else return u.body.clientWidth;return 0}function hc(){if(!!u.documentElement&&u.documentElement.clientHeight>0)return u.documentElement.clientHeight;if(!u.body){if(!!n.innerHeight)return n.innerHeight}else return u.body.clientHeight;return 0}function cc(){return n.orientation}function pf(n,t){var u="",i=n.indexOf(wo+t+ct),r;return i<0&&(i=n.indexOf("&"+t+ct)),i>=0&&(i+=t.length+2,r=n.indexOf("&",i),r<0&&(r=n.length),u=n.substring(i,r)),decodeURIComponent(u)}function lc(n){for(var i,r=n.split("&"),u=[],t=0;t<r.length;t++)i=r[t].split(ct),u[i[0]]=decodeURIComponent(i[1]);return u}function ac(n){return pf(bu.href,n)}function vc(n){return u.getElementById(n)}function yc(n){var t=u.getElementById(n).innerHTML;return t=t.replace(new RegExp("&lt;",ft),"<"),t.replace(new RegExp("&gt;",ft),">")}function ut(){return(new Date).getTime()}function pc(n){var i=n.length,t;for(e=[],t=0;t<i;t++)e[t]=n[t]}function br(n){for(var i=e.length,t=0;t<i;t++)if(e[t]==n)return 1<<t;return 0}function wc(n){var t=br(n.keyCode);(pt&t)==0&&(pt+=t);processEvent(4,n.keyCode)}function bc(n){var t=br(n.keyCode);(pt&t)!=0&&(pt-=t);processEvent(5,n.keyCode)}function kc(){return pt}function dc(n,t,i,r,u){this.x=n;this.y=t;this.width=i;this.height=r;this.id=u;this.shape=null;this.coords=null}function gc(){r=[]}function wf(n,t,i,u,f){r[r.length]=new dc(n,t,i,u,f)}function nl(n,t,u,f,e,o,s){var c,h;if(wf(n,t,u,f,e),!!i.isPointInPath)for(r[r.length-1].shape=o,c=s.split(w),r[r.length-1].coords=new Array(c.length),h=0;h<c.length;h++)r[r.length-1].coords[h]=parseInt(c[h])}function tl(n){if(r.length>0)for(var t=0;t<r.length;t++)if(r[t].id==n)return r[t];return null}function ot(n,t){var u,f;if(r.length>0)for(u=0;u<r.length;u++)if(r[u].shape==null){if(n>=r[u].x&&n<r[u].x+r[u].width&&t>=r[u].y&&t<r[u].y+r[u].height)return r[u].id}else{if(i.beginPath(),r[u].shape==bo)i.arc(r[u].x+r[u].coords[0],r[u].y+r[u].coords[1],r[u].coords[2],0,Math.PI*2,!1);else if(r[u].shape==ko){for(i.moveTo(r[u].x+r[u].coords[0],r[u].y+r[u].coords[1]),f=2;f<r[u].coords.length-1;f+=2)i.lineTo(r[u].x+r[u].coords[f],r[u].y+r[u].coords[f+1]);i.closePath()}else r[u].shape==go&&(i.moveTo(r[u].x+r[u].coords[0],r[u].y+r[u].coords[1]),i.lineTo(r[u].x+r[u].coords[2],r[u].y+r[u].coords[1]),i.lineTo(r[u].x+r[u].coords[2],r[u].y+r[u].coords[3]),i.lineTo(r[u].x+r[u].coords[0],r[u].y+r[u].coords[3]),i.closePath());if(i.isPointInPath(n,t))return r[u].id}return-1}function il(){for(var i=0,t,n=0;n<y.length;n++)t=ot(y[n],g[n]),t>=0&&(i|=1<<t);return i}function rl(n){return 1<<n}function kt(n){ci=n.clientX+u.body.scrollLeft+u.documentElement.scrollLeft-vi(f);li=n.clientY+u.body.scrollTop+u.documentElement.scrollTop-yi(f)}function kr(n){if(kt(n),et&&r.length>0){var t=ot(ci,li);if(t>=0){processEvent(6,t);return}}processEvent(8,0)}function dr(n){kt(n);processEvent(9,0)}function bf(n){kt(n);processEvent(10,0)}function kf(n){kt(n);processEvent(11,0)}function gr(n){if(kt(n),et&&r.length>0){var t=ot(ci,li);if(t>=0){processEvent(7,t);return}}processEvent(12,0)}function ul(){return ci}function fl(){return li}function nu(n){y=[];g=[];for(var t=0;t<n.touches.length;t++)y[t]=n.touches[t].pageX-vi(f),g[t]=n.touches[t].pageY-yi(f)}function el(n){if(nu(n),nt=y[0],tt=g[0],nt>=0&&nt<pr()&&tt>=0&&tt<wr()){if(ai=!0,et&&r.length>0){var t=ot(nt,tt);if(t>=0){processEvent(6,t);n.preventDefault();return}}processEvent(15,0);n.preventDefault()}}function ol(n){ai&&(nu(n),nt=y[0],tt=g[0],processEvent(16,0),n.preventDefault())}function sl(n){if(ai){if(ai=!1,nu(n),et&&r.length>0){var t=ot(nt,tt);if(t>=0){processEvent(7,t);n.preventDefault();return}}processEvent(17,0);n.preventDefault()}}function hl(){return y.length}function cl(n){return n<y.length?y[n]:nt}function ll(n){return n<g.length?g[n]:tt}function al(n){bu.replace(n)}function tu(n,t){rt=n;wt=t.indexOf(ns)>=0?lt+t+lt:t;b.style.cssText=cf+nf+rt+fi+wt}function iu(n){b.innerHTML=lt;var t=b.offsetWidth;return n=n.replace(new RegExp("<",ft),"&lt;"),n=n.replace(new RegExp(">",ft),"&gt;"),b.innerHTML=lt+n+lt,b.offsetWidth-t*2}function ru(){return rt}function df(n,t,i){yt||(s>=v.length&&(v[s]=u.createElement(du),v[s].style.cssText=ts,u.body.appendChild(v[s]),_USE_MOUSE&&(o(v[s],st,kr),o(v[s],sr,dr),o(v[s],ht,gr))),v[s].style.cssText=tf+(vi(f)+t)+rf+(yi(f)+i-rt)+is+it+nf+rt+fi+wt,n=n.replace(new RegExp("<",ft),"&lt;"),n=n.replace(new RegExp(">",ft),"&gt;"),v[s].innerHTML=n,s++)}function gf(){return!!u.createElement(ei).canPlayType}function vl(n){var t=u.createElement(ei);return!t.canPlayType?!1:t.canPlayType(n).replace(new RegExp(rs),"")!=""}function uu(){this.element=null;this.state=0;this.volume=100;this.id=ut()}function yl(){this.element=null;this.src=null;this.tag=null}function c(){return _USE_AUDIOEX&&!gf()?!0:!1}function pl(n){if(c())return fu(n);try{var t=new uu;return t.element=new Audio(""),t.element.autoplay=!1,t.element.src=n,t.element.load(),t}catch(i){}return null}function fu(n){var t=new yl;return t.src=n,t}function wl(n,t){if(c())return ne(n,t,audioExElement());try{var i=new uu;return i.element=new Audio(""),i.element.autoplay=!1,i.element.src=n,i.element.loop=t,i.element.play(),i.state=1,i}catch(r){}return null}function ne(n,t,i){var r=fu(n);return eu(r,t,i),r}function bl(n){if(c())return!0;if(n!=null)try{if(n.element.readyState>=4)return!0}catch(t){}return!1}function te(n){if(c()){ie(n);return}if(n!=null&&n.state!=0){try{n.state==2?n.element.currentTime=0:n.state!=1||n.element.ended||(n.element.pause(),n.element.currentTime=0)}catch(t){}n.state=0}}function ie(n){n!=null&&n.element!=null&&(n.element.setAttribute(lr,""),u.body.removeChild(n.element),n.element=null)}function kl(n){if((te(n),!c())&&n!=null)try{n.element.load()}catch(t){}}function dl(n,t){if(c()){eu(n,t,audioExElement());return}if(n!=null){if(n.state==1)try{n.element.ended||(n.element.pause(),n.element.currentTime=0)}catch(i){}try{n.element.loop=t;n.element.play();n.state=1}catch(i){}}}function eu(n,t,i){n!=null&&(n.element!=null&&(n.element.setAttribute(lr,""),u.body.removeChild(n.element)),n.tag=i,n.element=u.createElement(n.tag),n.element.setAttribute(lr,n.src),n.tag==ei?(n.element.setAttribute(us,at),t&&n.element.setAttribute(ar,at)):n.tag==fs?t&&n.element.setAttribute(ar,es):n.tag==os&&(n.element.setAttribute(ss,at),n.element.setAttribute(hs,cs),n.element.setAttribute(ls,uf),n.element.setAttribute(as,uf),t&&(n.element.setAttribute(ar,at),n.element.setAttribute(vs,at))),u.body.appendChild(n.element))}function gl(n){if(c())return re(n);if(n!=null&&n.state==1){try{return!n.element.ended}catch(t){}return!0}return!1}function re(n){if(n!=null&&n.element!=null){if(n.tag==ei)try{return!n.element.ended}catch(t){}return!0}return!1}function ue(n){if(!c()&&n!=null&&n.state==1)try{n.element.ended||(n.element.pause(),n.state=2)}catch(t){}}function na(n){if(!c()&&n!=null&&n.state==2)try{n.element.play();n.state=1}catch(t){}}function ta(n,t){if(!c()&&n!=null){n.volume=t;try{n.element.volume=n.volume/100}catch(i){}}}function ia(n){return c()?0:n!=null?n.volume:0}function ra(n){if(c())return 0;if(n!=null)try{return Math.floor(n.element.currentTime*1e3)}catch(t){}return 0}function ua(n,t,i,r){n!=null&&n.id==t&&n.state==1&&ou(n,i,r,!0)}function fa(n,t){n!=null&&n.id==t&&n.state==1&&ue(n)}function ea(n,t,i,r){try{var u=new uu;return u.element=new Audio(""),u.element.autoplay=!1,u.element.src=n,ou(u,t,i,r),u}catch(f){}return null}function ou(n,t,i,r){var u,f,e;if(n!=null)try{if(u=ut(),n.id=u,f=t/1e3,e=!1,n.state!=0)try{n.state==2?(n.element.currentTime=f,e=!0):n.state!=1||n.element.ended||(n.element.pause(),n.element.currentTime=f,e=!0)}catch(o){}if(n.element.loop=!1,n.element.play(),n.state=1,!e)try{n.element.currentTime=f}catch(o){}r?setTimeout(function(n,t,i,r){ua(n,t,i,r)},i,n,u,t,i):setTimeout(function(n,t){fa(n,t)},i,n,u)}catch(o){}}function dt(n){return n.e}function oa(n){return n.x}function sa(n){return n.y}function ha(n){return n.width}function ca(n){return n.height}function su(n,t){n.e.src=t}function p(n){n.e.style.cssText=tf+(vi(n.p)+n.x)+rf+(yi(n.p)+n.y)+ys+n.width+ps+n.height+ws}function la(n,t){n.x=t;p(n)}function aa(n,t){n.y=t;p(n)}function va(n,t,i){n.x=t;n.y=i;p(n)}function ya(n,t){n.width=t;p(n)}function pa(n,t){n.height=t;p(n)}function wa(n,t,i){n.width=t;n.height=i;p(n)}function fe(n,t,i,r,u){n.x=t;n.y=i;n.width=r;n.height=u;p(n)}function ee(n,t,i){n.a!=null&&(n.a.setAttribute(bs,t),n.a.setAttribute(ks,i))}function pi(n,t,i,r,u,f,e){this.p=n;this.e=t;this.c=i;this.m=null;this.a=null;fe(this,r,u,f,e)}function wi(n,t){n.onButtonDown=function(){processEvent(0,n.e)};n.onButtonOut=function(){processEvent(1,n.e)};n.onButtonOver=function(){processEvent(2,n.e)};n.onButtonUp=function(){processEvent(3,n.e)};var i=t?n.a:n.e;_USE_MOUSE&&(o(i,st,n.onButtonDown),o(i,ri,n.onButtonOut),o(i,ui,n.onButtonOver),o(i,ht,n.onButtonUp));_USE_TOUCH&&(o(i,fr,n.onButtonDown),o(i,er,n.onButtonOver),o(i,or,n.onButtonUp))}function hu(n,t,i,r,f,e){var o=new pi(n,u.createElement(ff),!0,i,r,f,e);return su(o,t),u.body.appendChild(o.e),wi(o,!1),o}function ba(n,t,i,r,f,e,o,s,h){var c=new pi(n,u.createElement(ff),!0,i,r,f,e);return su(c,t),c.e.setAttribute(ds,gs+o),c.e.setAttribute(nh,th),u.body.appendChild(c.e),c.m=u.createElement(ih),c.m.setAttribute(rh,o),u.body.appendChild(c.m),c.a=u.createElement(uh),ee(c,s,h),c.m.appendChild(c.a),wi(c,!0),c}function ka(n,t,i,r,f,e){var o=new pi(n,u.getElementById(t),!1,i,r,f,e);return wi(o,!1),o}function da(n,t,i,r,f,e,o){var s=new pi(n,u.getElementById(t),!1,i,r,f,e);return s.a=u.getElementById(o),wi(s,!0),s}function oe(n){if(n.c){var t=n.a!=null?n.a:n.e;_USE_MOUSE&&(h(t,st,n.onButtonDown),h(t,ri,n.onButtonOut),h(t,ui,n.onButtonOver),h(t,ht,n.onButtonUp));_USE_TOUCH&&(h(t,fr,n.onButtonDown),h(t,er,n.onButtonOver),h(t,or,n.onButtonUp));u.body.removeChild(n.e)}}function cu(){this.x=0;this.y=0;this.f=0}function se(){this.f=0;this.s=1}function ga(n){bi++;var t=new Image;return t.onload=function(){bi--},t.src=n,t}function nv(){return bi>0}function he(n,t){this.image=new Image;this.canvas=u.createElement(ku);this.context=this.canvas.getContext(gu);this.canvas.width=n;this.canvas.height=t;this.context.textAlign=hr;this.context.textBaseline=cr}function ce(n){this.s=n;this.o=[];this.id=-1}function tv(n){return gt.int(n)}function iv(n,t){return gt.div(n,t)}function rv(n,t){return gt.mod(n,t)}function le(){}function ve(n){this.o=new Array(n);this.n=0}function ye(){return vo.cookieEnabled}function uv(n){lu=new Date(ut()+n*864e5).toGMTString()}function ki(){return u.cookie.split(eh)}function au(n){var t=n.split(ct);return t[0]=t[0].replace(new RegExp("^\\s+"),""),t}function pe(){return u.cookie.length==0?0:ki().length}function we(n){var t,i;return u.cookie.length==0?"":(t=ki(),n>=t.length)?"":(i=au(t[n]),i[0])}function vu(n,t){for(var r,u=ki(),i=0;i<u.length;i++)if(r=au(u[i]),r[0]==n)return unescape(r[1]);return t}function di(n,t){var i,r;t==null&&(t="");i=lu;t.length==0&&(r=new Date,r.setTime(0),i=r.toGMTString());u.cookie=n+ct+escape(t)+oh+i}function be(n){for(var r,u=ki(),i=u.length-1;i>=0;i--)r=au(u[i]),(n==t||r[0].indexOf(n)==0)&&di(r[0],"")}function ke(n){l=vu(n,"");ni=0}function de(){if(ni>=l.length)gi="";else{var n=l.indexOf("&",ni);n<0&&(n=l.length);gi=l.substring(ni,n);ni=n+1}return unescape(gi)}function ge(){l="";gi=""}function no(){l=""}function to(n){l.length>0&&(l+="&");l+=escape(n)}function io(n){di(n,l);l=""}function yu(n,t){this._header=n;this._value=t}function fv(){nr=[]}function ev(n,t){nr[nr.length]=new yu(n,t)}function ov(){return nr}function ro(n,t){var i=null;if(!XMLHttpRequest){if(!!ActiveXObject)try{i=new ActiveXObject(sh)}catch(r){try{i=new ActiveXObject(hh)}catch(r){try{i=new ActiveXObject(ch)}catch(r){try{i=new ActiveXObject(lh)}catch(r){}}}}}else i=new XMLHttpRequest;return i!=null&&(i.open(n,t,!0),i.onreadystatechange=function(){i.readyState==4&&(i.status==200?onHttpResponse(i,i.responseText):onHttpError(i,i.status))}),i}function tr(n,t,i){n.setRequestHeader(t,i);onHttpSetRequestHeader(t,i)}function sv(n,i){var r=ro(ah,n),u;if(r!=null){if(tr(r,of,sf),i!=t)for(u=0;u<i.length;u++)i[u].set(r);r.send(null)}return r}function hv(n,i,r,u){var f=ro(vh,n),e;if(f!=null){if(tr(f,of,sf),tr(f,yh,r),u!=t)for(e=0;e<u.length;e++)u[e].set(f);f.send(i)}return f}function uo(n){this.s=n&&fo();this.c=ye()}function fo(){try{return n.localStorage!=null}catch(t){}return!1}function ir(){return n.localStorage.length}function pu(t){return t>=ir()?"":n.localStorage.key(t)}function wu(t,i){var r=n.localStorage.getItem(t);return r==null?i:r}function rr(t,i){i!=null&&i.length>0?n.localStorage.setItem(t,i):n.localStorage.removeItem(t)}function eo(i){var f,u,r;if(i==t)n.localStorage.clear();else for(f=ir(),r=f-1;r>=0;r--)u=pu(r),(i==t||u.indexOf(i)==0)&&rr(u,null)}function oo(n){a=wu(n,"");ti=0}function so(){if(ti>=a.length)ur="";else{var n=a.indexOf("&",ti);n<0&&(n=a.length);ur=a.substring(ti,n);ti=n+1}return unescape(ur)}function ho(){a="";ur=""}function co(){a=""}function lo(n){a.length>0&&(a+="&");a+=escape(n)}function ao(n){rr(n,a);a=""}var u=n.document,bu=n.location,vo=n.navigator,ku="canvas",yo="keydown",po="keyup",fr="touchstart",er="touchmove",or="touchend",du="span",ii="on",st="mousedown",sr="mousemove",ri="mouseout",ui="mouseover",ht="mouseup",gu="2d",hr="left",cr="bottom",wo="?",ct="=",ft="igm",w=",",bo="circle",ko="poly",go="rect",ns=" ",lt="'",nf=";font:",fi="px ",ts="position:absolute",tf="position:absolute;left:",rf="px;top:",is="px;color:",ei="audio",rs="no",lr="src",us="autoplay",at="true",ar="loop",fs="bgsound",es="infinite",os="embed",ss="autostart",hs="hidden",cs="false",ls="width",uf="1",as="height",vs="repeat",ys="px;width:",ps="px;height:",ws="px",bs="shape",ks="coords",ff="img",ds="usemap",gs="#",nh="border",th="0",ih="map",rh="name",uh="area",ef="rgb(",vr=")",fh="rgba(",eh=";",oh="; expires=",sh="Msxml2.XMLHTTP.6.0",hh="Msxml2.XMLHTTP.3.0",ch="Msxml2.XMLHTTP",lh="Microsoft.XMLHTTP",ah="GET",of="If-Modified-Since",sf="Thu, 01 Jun 1970 00:00:00 GMT",vh="POST",yh="Content-Type",yr,bi,gt,ae,lu,l,ni,gi,nr,a,ti,ur;n._USE_AUDIOEX=!1;n._USE_DRAWSTRINGEX=!1;n._USE_EXCANVAS=!1;n._USE_KEY=!1;n._USE_MOUSE=!1;n._USE_TOUCH=!1;n._USE_LAYOUTMOUSE=!1;n._USE_LAYOUTTOUCH=!1;n._USE_REQUESTANIMATIONFRAME=!1;var oi=!1,si,vt,d,f=null,i,yt,hi,pt=0,e,et=!1,r=[],ci,li,ai=!1,y=[],g=[],nt,tt,it,rt,wt,v=[],s,b,cf="visibility:hidden;position:absolute;left:0;top:0";yr=function(){if(_USE_DRAWSTRINGEX&&(s=0),i.clearRect(0,0,pr(),wr()),i.save(),paint(hi),i.restore(),_USE_DRAWSTRINGEX)for(var n=s;n<v.length;n++)v[n].innerHTML=""};cu.prototype={canUseClip:function(){return!!i.clip},canUseText:function(){return!!i.fillText},getColorOfRGB:function(n,t,i){return ef+n+w+t+w+i+vr},getColorOfRGBA:function(n,t,i,r){return fh+n+w+t+w+i+w+r/255+vr},setStrokeWidth:function(n){i.lineWidth=n},setColor:function(n){it=n;i.fillStyle=it;i.strokeStyle=it},setAlpha:function(n){i.globalAlpha=n/255},setROP:function(n){i.globalCompositeOperation=n},setFont:function(n,t){tu(n,t);i.font=""+rt+fi+wt},stringWidth:function(n){return iu(n)},fontHeight:function(){return ru()},clearClip:function(){i.restore();i.save()},setOrigin:function(n,t){this.x=n;this.y=t},setClip:function(n,t,r,u){n+=this.x;t+=this.y;!i.clip||(i.restore(),i.save(),i.beginPath(),i.moveTo(n,t),i.lineTo(n+r,t),i.lineTo(n+r,t+u),i.lineTo(n,t+u),i.closePath(),i.clip())},drawLine:function(n,t,r,u){n+=this.x;t+=this.y;r+=this.x;u+=this.y;i.beginPath();i.moveTo(n+.5,t+.5);i.lineTo(r+.5,u+.5);i.stroke();i.closePath()},drawRect:function(n,t,r,u){n+=this.x;t+=this.y;i.strokeRect(n+.5,t+.5,r,u)},fillRect:function(n,t,r,u){n+=this.x;t+=this.y;i.fillRect(n,t,r,u)},drawCircle:function(n,t,r){n+=this.x;t+=this.y;i.beginPath();i.arc(n,t,r,0,Math.PI*2,!1);i.stroke()},drawString:function(n,t,r){t+=this.x;r+=this.y;i.fillText?i.fillText(n,t,r):_USE_DRAWSTRINGEX&&df(n,t,r)},setFlipMode:function(n){this.f=n},drawScaledImage:function(n,t,r,u,f,e,o,s,h){if(t+=this.x,r+=this.y,this.f==0)try{i.drawImage(n,e,o,s,h,t,r,u,f)}catch(c){}else{i.save();i.setTransform(1,0,0,1,0,0);switch(this.f){case 1:i.translate(t+u,r);i.scale(-1,1);break;case 2:i.translate(t,r+f);i.scale(1,-1);break;case 3:i.translate(t+u,r+f);i.scale(-1,-1)}try{i.drawImage(n,e,o,s,h,0,0,u,f)}catch(c){}i.restore()}},drawImage:function(n,t,i){this.drawScaledImage(n,t,i,n.width,n.height,0,0,n.width,n.height)},drawTransImage:function(n,t,r,u,f,e,o,s,h,c,l,a){t+=this.x;r+=this.y;i.save();i.setTransform(1,0,0,1,0,0);i.translate(t,r);i.rotate(Math.PI*c/180);i.scale(l/128,a/128);i.translate(-s,-h);try{i.drawImage(n,u,f,e,o,0,0,e,o)}catch(v){}i.restore()}};se.prototype={canUseClip:function(){return!!i.clip},canUseText:function(){return!!i.fillText},setScale:function(n){this.s=n},scale:function(){return this.s},getColorOfRGB:function(n,t,i){return ef+n+w+t+w+i+vr},setStrokeWidth:function(n){i.lineWidth=n*this.s},setColor:function(n){it=n;i.fillStyle=it;i.strokeStyle=it},setAlpha:function(n){i.globalAlpha=n/255},setROP:function(n){i.globalCompositeOperation=n},setFont:function(n,t){tu(Math.floor(n*this.s),t);i.font=""+rt+fi+wt},stringWidth:function(n){return this.s==0?0:iu(n)/this.s},fontHeight:function(){return this.s==0?0:ru()/this.s},clearClip:function(){i.restore();i.save()},setOrigin:function(n,t){this.x=n;this.y=t},setClip:function(n,t,r,u){n+=this.x;t+=this.y;!i.clip||(i.restore(),i.save(),i.beginPath(),i.moveTo(n*this.s,t*this.s),i.lineTo(n*this.s+r*this.s,t*this.s),i.lineTo(n*this.s+r*this.s,t*this.s+u*this.s),i.lineTo(n*this.s,t*this.s+u*this.s),i.closePath(),i.clip())},drawLine:function(n,t,r,u){n+=this.x;t+=this.y;r+=this.x;u+=this.y;i.beginPath();i.moveTo((n+.5)*this.s,(t+.5)*this.s);i.lineTo((r+.5)*this.s,(u+.5)*this.s);i.stroke();i.closePath()},drawRect:function(n,t,r,u){n+=this.x;t+=this.y;i.strokeRect((n+.5)*this.s,(t+.5)*this.s,r*this.s,u*this.s)},fillRect:function(n,t,r,u){n+=this.x;t+=this.y;i.fillRect(n*this.s,t*this.s,r*this.s,u*this.s)},drawCircle:function(n,t,r){n+=this.x;t+=this.y;i.beginPath();i.arc(n*this.s,t*this.s,r*this.s,0,Math.PI*2,!1);i.stroke()},drawString:function(n,t,r){t+=this.x;r+=this.y;i.fillText?i.fillText(n,t*this.s,r*this.s):_USE_DRAWSTRINGEX&&df(n,t*this.s,r*this.s)},setFlipMode:function(n){this.f=n},drawScaledImage:function(n,t,r,u,f,e,o,s,h){if(t+=this.x,r+=this.y,this.f==0)try{i.drawImage(n,e,o,s,h,t*this.s,r*this.s,u*this.s,f*this.s)}catch(c){}else{i.save();i.setTransform(1,0,0,1,0,0);switch(this.f){case 1:i.translate((t+u)*this.s,r*this.s);i.scale(-this.s,this.s);break;case 2:i.translate(t*this.s,(r+f)*this.s);i.scale(this.s,-this.s);break;case 3:i.translate((t+u)*this.s,(r+f)*this.s);i.scale(-this.s,-this.s)}try{i.drawImage(n,e,o,s,h,0,0,u,f)}catch(c){}i.restore()}},drawImage:function(n,t,i){this.drawScaledImage(n,t,i,n.width,n.height,0,0,n.width,n.height)},drawTransImage:function(n,t,r,u,f,e,o,s,h,c,l,a){t+=this.x;r+=this.y;i.save();i.setTransform(1,0,0,1,0,0);i.translate(t*this.s,r*this.s);i.rotate(Math.PI*c/180);i.scale(l*this.s/128,a*this.s/128);i.translate(-s,-h);try{i.drawImage(n,u,f,e,o,0,0,e,o)}catch(v){}i.restore()}};bi=0;he.prototype={lock:function(){this.sav_canvas=f;this.sav_context=i;this.sav_lock=yt;f=this.canvas;i=this.context;yt=!0;i.clearRect(0,0,f.width,f.height);i.save()},unlock:function(){i.restore();f=this.sav_canvas;i=this.sav_context;yt=this.sav_lock;this.image.src=this.canvas.toDataURL()},getWidth:function(){return this.canvas.width},getHeight:function(){return this.canvas.height},getImage:function(){return this.image}};ce.prototype={clear:function(){for(var n=0;n<this.o.length;n++)oe(this.o[n]);this.o=[]},add:function(n,t,i,r,u){this.o[this.o.length]=hu(f,this.s,n,t,i,r);this.o[this.o.length-1].id=u},addArea:function(n,t,i,r,u,e,o,s){this.o[this.o.length]=hu(f,this.s,n,t,i,r,e,o,s);this.o[this.o.length-1].id=u},get:function(n){for(var t=0;t<this.o.length;t++)if(this.o[t].id==n)return this.o[t];return null},check:function(){return this.id},handleEvent:function(n,t){var i;switch(n){case 0:for(i=0;i<this.o.length;i++)if(t==dt(this.o[i])){processEvent(6,this.o[i].id);break}break;case 1:for(i=0;i<this.o.length;i++)if(t==dt(this.o[i])){this.id=-1;break}break;case 2:for(i=0;i<this.o.length;i++)if(t==dt(this.o[i])){this.id=this.o[i].id;break}break;case 3:for(i=0;i<this.o.length;i++)if(t==dt(this.o[i])){processEvent(7,this.o[i].id);break}break;case 14:for(i=0;i<this.o.length;i++)p(this.o[i])}}};gt={int:function(n){return n<0?Math.ceil(n):Math.floor(n)},div:function(n,t){return n<0?Math.ceil(n/t):Math.floor(n/t)},mod:function(n,t){return n<0?(n=-n,-(n-Math.floor(n/t)*t)):n-Math.floor(n/t)*t}};le.prototype={next:function(n){return Math.random()<.5?-Math.floor(Math.random()*n):Math.floor(Math.random()*n)},nextInt:function(){return Math.random()<.5?-Math.floor(Math.random()*2147483648):Math.floor(Math.random()*2147483648)}};ae={arraycopy:function(n,t,i,r,u){for(var f=0;f<u;f++)i[r+f]=n[t+f]}};ve.prototype={size:function(){return this.n},isEmpty:function(){return this.n==0},elementAt:function(n){return this.o[n]},firstElement:function(){return this.o[0]},lastElement:function(){return this.o[this.n-1]},setElementAt:function(n,t){t>=0&&t<this.n&&(this.o[t]=n)},removeElementAt:function(n){if(n>=0&&n<this.n){for(this.i=n;this.i<this.n-1;this.i++)this.o[this.i]=this.o[this.i+1];this.n--}},insertElementAt:function(n,t){if(t>=0&&t<this.n){for(this.i=this.n-1;this.i>=t;this.i--)this.o[this.i+1]=this.o[this.i];this.o[t]=n;this.n++}},addElement:function(n){this.o[this.n]=n;this.n++},removeAllElements:function(){this.n=0}};lu="Tue, 01 Jan 2030 00:00:00 GMT";yu.prototype={set:function(n){tr(n,this._header,this._value)}};uo.prototype={num:function(){return this.s?ir():this.c?pe():0},getKey:function(n){return this.s?pu(n):this.c?we(n):null},get:function(n,t){return this.s?wu(n,t):this.c?vu(n,t):t},set:function(n,t){this.s?rr(n,t):this.c&&di(n,t)},clear:function(n){this.s?eo(n):this.c&&be(n)},beginRead:function(n){this.s?oo(n):this.c&&ke(n)},read:function(){return this.s?so():this.c?de():""},endRead:function(){this.s?ho():this.c&&ge()},beginWrite:function(){this.s?co():this.c&&no()},write:function(n){this.s?lo(n):this.c&&to(n)},endWrite:function(n){this.s?ao(n):this.c&&io(n)}};n.canUseCanvas=hf;n.d2js_onload=ph;n.d2js_onorientationchange=wh;n.d2js_onresize=bh;n.setTimer=lf;n.killTimer=kh;n.setRepaintFunc=dh;n.removeMouseEvent=gh;n.addMouseEvent=vf;n.setCurrent=nc;n.setGraphics=tc;n.getCurrent=ic;n.getCurrentContext=rc;n.getGraphics=uc;n.setCanvas=fc;n.setContext=ec;n.initLock=yf;n.setCanvasSize=oc;n.getWidth=pr;n.getHeight=wr;n.getBrowserWidth=sc;n.getBrowserHeight=hc;n.getOrientation=cc;n.readParameter=pf;n.readParameters=lc;n.getParameter=ac;n.getResImage=vc;n.getResString=yc;n.currentTimeMillis=ut;n.setKeyArray=pc;n.keyBit=br;n.getKeypadState=kc;n.clearLayout=gc;n.addLayout=wf;n.addLayoutArea=nl;n.getLayout=tl;n.checkLayout=ot;n.getLayoutState=il;n.layoutBit=rl;n.getMouseX=ul;n.getMouseY=fl;n.touchNum=hl;n.getTouchX=cl;n.getTouchY=ll;n.launch=al;n.setFont=tu;n.stringWidth=iu;n.fontHeight=ru;n.canUseAudio=gf;n.canPlayType=vl;n.loadAudio=pl;n.loadAudioEx=fu;n.loadAndPlayAudio=wl;n.loadAndPlayAudioEx=ne;n.isLoaded=bl;n.stopAudio=te;n.stopAudioEx=ie;n.reloadAudio=kl;n.playAudio=dl;n.playAudioEx=eu;n.isPlaying=gl;n.isPlayingEx=re;n.pauseAudio=ue;n.restartAudio=na;n.setVolume=ta;n.getVolume=ia;n.getCurrentTime=ra;n.loadAndPlayAudioSprite=ea;n.playAudioSprite=ou;n.buttonElement=dt;n.buttonX=oa;n.buttonY=sa;n.buttonWidth=ha;n.buttonHeight=ca;n.setButtonSrc=su;n.updateButtonPos=p;n.setButtonX=la;n.setButtonY=aa;n.setButtonPos=va;n.setButtonWidth=ya;n.setButtonHeight=pa;n.setButtonSize=wa;n.setButtonPosSize=fe;n.setButtonArea=ee;n.createButton=hu;n.createButtonArea=ba;n.attachButton=ka;n.attachButtonArea=da;n.removeButton=oe;n._Graphics=cu;n._ScalableGraphics=se;n.loadImage=ga;n.isImageBusy=nv;n._Image=he;n._Layout=ce;n._Math=gt;n._INT=tv;n._DIV=iv;n._MOD=rv;n._Random=le;n._System=ae;n._Vector=ve;n.canUseCookie=ye;n.setExpiresDate=uv;n.cookieNum=pe;n.getCookieKey=we;n.getCookie=vu;n.setCookie=di;n.clearCookie=be;n.beginCookieRead=ke;n.cookieRead=de;n.endCookieRead=ge;n.beginCookieWrite=no;n.cookieWrite=to;n.endCookieWrite=io;n._HttpRequestHeader=yu;n.httpInitHeader=fv;n.httpAddHeader=ev;n.httpHeader=ov;n.httpGet=sv;n.httpPost=hv;n._Preference=uo;n.canUseStorage=fo;n.storageNum=ir;n.getStorageKey=pu;n.getStorage=wu;n.setStorage=rr;n.clearStorage=eo;n.beginStorageRead=oo;n.storageRead=so;n.endStorageRead=ho;n.beginStorageWrite=co;n.storageWrite=lo;n.endStorageWrite=ao;n._KEY_BACKSPACE=8;n._KEY_TAB=9;n._KEY_ENTER=13;n._KEY_SELECT=n._KEY_ENTER;n._KEY_SHIFT=16;n._KEY_CTRL=17;n._KEY_SPACE=32;n._KEY_LEFT=37;n._KEY_UP=38;n._KEY_RIGHT=39;n._KEY_DOWN=40;n._KEY_0=48;n._KEY_1=49;n._KEY_2=50;n._KEY_3=51;n._KEY_4=52;n._KEY_5=53;n._KEY_6=54;n._KEY_7=55;n._KEY_8=56;n._KEY_9=57;n._KEY_A=65;n._KEY_B=66;n._KEY_C=67;n._KEY_D=68;n._KEY_E=69;n._KEY_F=70;n._KEY_G=71;n._KEY_H=72;n._KEY_I=73;n._KEY_J=74;n._KEY_K=75;n._KEY_L=76;n._KEY_M=77;n._KEY_N=78;n._KEY_O=79;n._KEY_P=80;n._KEY_Q=81;n._KEY_R=82;n._KEY_S=83;n._KEY_T=84;n._KEY_U=85;n._KEY_V=86;n._KEY_W=87;n._KEY_X=88;n._KEY_Y=89;n._KEY_Z=90;n._ROP_COPY="source-over";n._ROP_ADD="lighter";n._FLIP_NONE=0;n._FLIP_HORIZONTAL=1;n._FLIP_VERTICAL=2;n._FLIP_ROTATE=3;n._BUTTON_DOWN_EVENT=0;n._BUTTON_OUT_EVENT=1;n._BUTTON_OVER_EVENT=2;n._BUTTON_UP_EVENT=3;n._KEY_PRESSED_EVENT=4;n._KEY_RELEASED_EVENT=5;n._LAYOUT_DOWN_EVENT=6;n._LAYOUT_UP_EVENT=7;n._MOUSE_DOWN_EVENT=8;n._MOUSE_MOVE_EVENT=9;n._MOUSE_OUT_EVENT=10;n._MOUSE_OVER_EVENT=11;n._MOUSE_UP_EVENT=12;n._ORIENTATIONCHANGE_EVENT=13;n._RESIZE_EVENT=14;n._TOUCH_START_EVENT=15;n._TOUCH_MOVE_EVENT=16;n._TOUCH_END_EVENT=17})(window)