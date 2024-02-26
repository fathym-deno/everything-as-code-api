import{a as O,b as B,c as R,d as _,e as $,f as X}from"./chunk-REY47OEU.js";typeof globalThis>"u"&&(window.globalThis=window);var Y="94875dba797391ef4a86bbf9b64fcc612c4f12fd";var j="/_frsh",z="__frsh_c";function G(e){if(!e.startsWith("/")||e.startsWith("//"))return e;try{let t=new URL(e,"https://freshassetcache.local");return t.protocol!=="https:"||t.host!=="freshassetcache.local"||t.searchParams.has(z)?e:(t.searchParams.set(z,Y),t.pathname+t.search+t.hash)}catch(t){return console.warn(`Failed to create asset() URL, falling back to regular path ('${e}'):`,t),e}}function de(e){if(e.includes("("))return e;let t=e.split(","),r=[];for(let n of t){let o=n.trimStart(),a=n.length-o.length;if(o==="")return e;let s=o.indexOf(" ");s===-1&&(s=o.length);let l=n.substring(0,a),i=o.substring(0,s),d=o.substring(s);r.push(l+G(i)+d)}return r.join(",")}function J(e){if(e.type==="img"||e.type==="source"){let{props:t}=e;if(t["data-fresh-disable-lock"])return;typeof t.src=="string"&&(t.src=G(t.src)),typeof t.srcset=="string"&&(t.srcset=de(t.srcset))}}var k="fresh-partial",L="f-partial",w="f-loading",P="f-client-nav",W="data-fresh-key",b="data-current",x="data-ancestor";function K(e,t){let r=new URL(t,"http://localhost").pathname;return r!=="/"&&r.endsWith("/")&&(r=r.slice(0,-1)),e!=="/"&&e.endsWith("/")&&(e=e.slice(0,-1)),e===r?2:e.startsWith(r+"/")||r==="/"?1:0}function Q(e,t){let r=e.props,n=r.href;if(typeof n=="string"&&n.startsWith("/")){let o=K(t,n);o===2?(r[b]="true",r["aria-current"]="page"):o===1&&(r[x]="true",r["aria-current"]="true")}}function ce(e,t,r){return e.__k={_frshRootFrag:!0,nodeType:1,parentNode:e,nextSibling:null,get firstChild(){let n=t.nextSibling;return n===r?null:n},get childNodes(){let n=[],o=t.nextSibling;for(;o!==null&&o!==r;)n.push(o),o=o.nextSibling;return n},insertBefore(n,o){e.insertBefore(n,o??r)},appendChild(n){e.insertBefore(n,r)},removeChild(n){e.removeChild(n)}}}function ne(e){return e.nodeType===Node.COMMENT_NODE}function ue(e){return e.nodeType===Node.TEXT_NODE}function re(e){return e.nodeType===Node.ELEMENT_NODE&&!("_frshRootFrag"in e)}function Ie(e,t){let r=[];U(e,t,[],[R(_,null)],document.body,r);for(let n=0;n<r.length;n++){let{vnode:o,rootFragment:a}=r[n],s=()=>{X(o,a)};"scheduler"in window?scheduler.postTask(s):setTimeout(s,0)}}function oe(e){return e.children}oe.displayName="PreactServerComponent";function H(e,t){let r=e.props;r.children==null?r.children=t:Array.isArray(r.children)?r.children.push(t):r.children=[r.children,t]}var v=class extends ${componentDidMount(){se.set(this.props.name,this)}render(){return this.props.children}};var Z=!1,se=new Map;function q(e){let{startNode:t,endNode:r}=e,n=r.parentNode;if(!Z&&t!==null&&t.nodeType===Node.COMMENT_NODE){let o=new Text("");e.startNode=o,n.insertBefore(o,t),t.remove()}if(!Z&&r!==null&&r.nodeType===Node.COMMENT_NODE){let o=new Text("");e.endNode=o,n.insertBefore(o,r),r.remove()}}function ee(e,t,r,n,o,a){let[s,l]=o.slice(6).split(":"),i=`#frsh-slot-${s}-${l}-children`,d=document.querySelector(i);if(d!==null){r.push({kind:1,endNode:null,startNode:null,text:o.slice(1)});let c=d.content.cloneNode(!0);U(e,t,r,n,c,a),r.pop()}}function U(e,t,r,n,o,a){let s=o;for(;s!==null;){let l=r.length>0?r[r.length-1]:null;if(ne(s)){let i=s.data;if(i.startsWith("!--")&&(i=i.slice(3,-2)),i.startsWith("frsh-slot"))r.push({startNode:s,text:i,endNode:null,kind:1}),n.push(R(oe,{id:i}));else if(i.startsWith("frsh-partial")){let[d,c,p,N]=i.split(":");r.push({startNode:s,text:c,endNode:null,kind:2}),n.push(R(v,{name:c,key:N,mode:+p}))}else if(i.startsWith("frsh-key:")){let d=i.slice(9);n.push(R(_,{key:d}))}else if(i.startsWith("/frsh-key:")){let d=n.pop(),c=n[n.length-1];H(c,d),s=s.nextSibling;continue}else if(l!==null&&(i.startsWith("/frsh")||l.text===i)){if(l.endNode=s,r.pop(),l.kind===1){let d=n.pop(),c=n[n.length-1];c.props.children=d,q(l),s=l.endNode.nextSibling;continue}else if(l!==null&&(l.kind===0||l.kind===2))if(r.length===0){let d=n[n.length-1];d.props.children==null&&ee(e,t,r,n,i,a),n.pop();let c=s.parentNode;q(l);let p=ce(c,l.startNode,l.endNode);a.push({vnode:d,marker:l,rootFragment:p}),s=l.endNode.nextSibling;continue}else{let d=n[n.length-1];d&&d.props.children==null?(ee(e,t,r,n,i,a),d.props.children==null&&n.pop()):n.pop(),l.endNode=s,q(l);let c=n[n.length-1];H(c,d),s=l.endNode.nextSibling;continue}}else if(i.startsWith("frsh")){let[d,c,p]=i.slice(5).split(":"),N=t[Number(c)];r.push({startNode:s,endNode:null,text:i,kind:0});let g=R(e[d],N);p&&(g.key=p),n.push(g)}}else if(ue(s)){let i=n[n.length-1];l!==null&&(l.kind===1||l.kind===2)&&H(i,s.data)}else{let i=n[n.length-1];if(re(s))if(l!==null&&(l.kind===1||l.kind===2)){let c={children:s.childNodes.length<=1?null:[]},p=!1;for(let g=0;g<s.attributes.length;g++){let f=s.attributes[g];if(f.nodeName===W){p=!0,c.key=f.nodeValue;continue}else if(f.nodeName===w){let h=f.nodeValue,u=t[Number(h)][w].value;s._freshIndicator=u}c[f.nodeName]=typeof s[f.nodeName]=="boolean"?!0:f.nodeValue}p&&s.removeAttribute(W);let N=R(s.localName,c);H(i,N),n.push(N)}else{let d=s.getAttribute(w);if(d!==null){let c=t[Number(d)][w].value;s._freshIndicator=c}}s.firstChild&&s.nodeName!=="SCRIPT"&&U(e,t,r,n,s.firstChild,a),l!==null&&l.kind!==0&&n.pop()}s!==null&&(s=s.nextSibling)}}var fe="Unable to process partial response.";async function S(e,t={}){t.redirect="follow",e.searchParams.set(k,"true");let r=await fetch(e,t);await he(r)}function ie(e){document.querySelectorAll("a").forEach(t=>{let r=K(e.pathname,t.href);r===2?(t.setAttribute(b,"true"),t.setAttribute("aria-current","page"),t.removeAttribute(x)):r===1?(t.setAttribute(x,"true"),t.setAttribute("aria-current","true"),t.removeAttribute(b)):(t.removeAttribute(b),t.removeAttribute(x),t.removeAttribute("aria-current"))})}function le(e,t,r,n){let o=null,a=n.firstChild,s=0;for(;a!==null;){if(ne(a)){let l=a.data;if(l.startsWith("frsh-partial"))o=a,s++;else if(l.startsWith("/frsh-partial")){s--;let i={_frshRootFrag:!0,nodeType:1,nextSibling:null,firstChild:o,parentNode:n,get childNodes(){let d=[o],c=o;for(;(c=c.nextSibling)!==null;)d.push(c);return d}};U(t,r[0]??[],[],[R(_,null)],i,e)}}else s===0&&re(a)&&le(e,t,r,a);a=a.nextSibling}}var D=class extends Error{};async function he(e){let t=e.headers.get("Content-Type"),r=e.headers.get("X-Fresh-UUID");if(t!=="text/html; charset=utf-8")throw new Error(fe);let n=await e.text(),o=new DOMParser().parseFromString(n,"text/html"),a=[],s={},l=o.getElementById(`__FRSH_PARTIAL_DATA_${r}`),i=null;l!==null&&(i=JSON.parse(l.textContent),a.push(...Array.from(Object.entries(i.islands)).map(async f=>{let h=await import(`${f[1].url}`);s[f[0]]=h[f[1].export]})));let d=o.getElementById(`__FRSH_STATE_${r}`)?.textContent,c=[[],[]],p;i!==null&&i.signals!==null&&a.push(import(i.signals).then(f=>{p=f.signal}));let N;d&&i&&i.deserializer!==null&&a.push(import(i.deserializer).then(f=>N=f.deserialize)),await Promise.all(a),d&&(c=N?N(d,p):JSON.parse(d)?.v);let g=[];if(le(g,s,c,o.body),g.length===0)throw new D(`Found no partials in HTML response. Please make sure to render at least one partial. Requested url: ${e.url}`);o.title&&(document.title=o.title),Array.from(o.head.childNodes).forEach(f=>{let h=f;if(h.nodeName!=="TITLE"){if(h.nodeName==="META"){let u=h;if(u.hasAttribute("charset"))return;let y=u.name;if(y!==""){let T=document.head.querySelector(`meta[name="${y}"]`);T!==null?T.content!==u.content&&(T.content=u.content):document.head.appendChild(u)}else{let T=h.getAttribute("property"),m=document.head.querySelector(`meta[property="${T}"]`);m!==null?m.content!==u.content&&(m.content=u.content):document.head.appendChild(u)}}else if(h.nodeName==="LINK"){let u=h;if(u.rel==="modulepreload")return;u.rel==="stylesheet"&&Array.from(document.head.querySelectorAll("link")).find(T=>T.href===u.href)===void 0&&document.head.appendChild(u)}else if(h.nodeName==="SCRIPT"){if(h.src===`${j}/refresh.js`)return}else if(h.nodeName==="STYLE"){let u=h;u.id===""&&document.head.appendChild(u)}}});for(let f=0;f<g.length;f++){let{vnode:h,marker:u}=g[f],y=se.get(u.text);if(!y)console.warn(`Partial "${u.text}" not found. Skipping...`);else{let T=h.props.mode,m=h.props.children;if(T===0)y.props.children=m;else{let V=y.props.children,E=Array.isArray(V)?V:[V];if(T===1)E.push(m);else{B(m)||(m=R(_,null,m)),m.key==null&&(m.key=E.length);let F=y.__v.__k;if(Array.isArray(F))for(let A=0;A<F.length;A++){let C=F[A];if(C.key==null)C.key=A;else break}for(let A=0;A<E.length;A++){let C=E[A];if(C.key==null)C.key=A;else break}E.unshift(m)}y.props.children=E}y.setState({})}}}var te=O.vnode;O.vnode=e=>{J(e),e.type==="a"&&Q(e,location.pathname),te&&te(e)};function M(e){if(e===null)return document.querySelector(`[${P}="true"]`)!==null;let t=e.closest(`[${P}]`);return t===null?!1:t.getAttribute(P)==="true"}var I=history.state?.index||0;if(!history.state){let e={index:I,scrollX,scrollY};history.replaceState(e,document.title)}function ae(e){if(e.href!==window.location.href){let t={index:I,scrollX:window.scrollX,scrollY:window.scrollY};history.replaceState({...t},"",location.href),I++,t.scrollX=0,t.scrollY=0,history.pushState(t,"",e.href)}}document.addEventListener("click",async e=>{let t=e.target;if(t&&t instanceof HTMLElement){let r=t;if(t.nodeName!=="A"&&(t=t.closest("a")),t&&t instanceof HTMLAnchorElement&&t.href&&(!t.target||t.target==="_self")&&t.origin===location.origin&&e.button===0&&!(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.button)&&!e.defaultPrevented){let n=t.getAttribute(L);if(t.getAttribute("href")?.startsWith("#")||!M(t))return;let o=t._freshIndicator;o!==void 0&&(o.value=!0),e.preventDefault();let a=new URL(t.href);try{ae(a);let s=new URL(n||a.href,location.href);await S(s),ie(a),scrollTo({left:0,top:0,behavior:"instant"})}finally{o!==void 0&&(o.value=!1)}}else{let n=r;if(n.nodeName!=="A"&&(n=n.closest("button")),n!==null&&n instanceof HTMLButtonElement&&(n.type!=="submit"||n.form===null)){let o=n.getAttribute(L);if(o===null||!M(n))return;let a=new URL(o,location.href);await S(a)}}}});addEventListener("popstate",async e=>{if(e.state===null){history.scrollRestoration&&(history.scrollRestoration="auto");return}let t=history.state;if(I=t.index??I+1,!M(null)){location.reload();return}history.scrollRestoration&&(history.scrollRestoration="manual");let n=new URL(location.href,location.origin);try{await S(n),ie(n),scrollTo({left:t.scrollX??0,top:t.scrollY??0,behavior:"instant"})}catch(o){if(o instanceof D){location.reload();return}throw o}});document.addEventListener("submit",async e=>{let t=e.target;if(t!==null&&t instanceof HTMLFormElement&&!e.defaultPrevented){if(!M(t)||e.submitter!==null&&!M(e.submitter))return;let r=e.submitter?.getAttribute("formmethod")?.toLowerCase()??t.method.toLowerCase();if(r!=="get"&&r!=="post"&&r!=="dialog")return;let n=e.submitter?.getAttribute(L)??e.submitter?.getAttribute("formaction")??t.getAttribute(L)??t.action;if(n!==""){e.preventDefault();let o=new URL(n,location.href),a;r==="get"?new URLSearchParams(new FormData(t)).forEach((l,i)=>o.searchParams.set(i,l)):a={body:new FormData(t),method:r},ae(o),await S(o,a)}}});export{he as applyPartials,Ie as revive};
