import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter,Routes,Route,Link,useNavigate} from "react-router-dom";
import {Menu,X,Bell,Home,Send,Globe2,Users,UserCircle,HelpCircle,MapPin,Phone,LogOut,ShieldCheck,ArrowRight,ArrowLeft,CheckCircle2,WalletCards,Landmark,Banknote,LockKeyhole,Smartphone,ChevronRight,FileText,Settings,Clock3} from "lucide-react";
import "./styles.css";
import {register as apiRegister, login as apiLogin, setSession, clearSession, getSessionUser, getMe, getRecipients, createRecipient, updateRecipient, deleteRecipient, getOrders, createOrder, adminOverview, adminUsers, assignRole, adminAudit, adminSettings, updateSetting, updateOrderStatus} from "./api.js";

const countries=[{name:"India",currency:"INR",flag:"IN"},{name:"Zimbabwe",currency:"USD",flag:"ZW"},{name:"South Africa",currency:"ZAR",flag:"ZA"}];
const banks=["HDFC Bank","ICICI Bank","State Bank of India","Axis Bank","Kotak Mahindra Bank","Other / Partner Bank"];

function Header(){
 const [open,setOpen]=useState(false);
 return <header className="header"><div className="container nav">
  <Link className="brand" to="/"><span className="brand-mark">MW</span><span>Mula<span>Wave</span></span></Link>
  <nav className={open?"nav-links mobile-open":"nav-links"}>
   <Link to="/dashboard" onClick={()=>setOpen(false)}>Dashboard</Link><Link to="/send" onClick={()=>setOpen(false)}>Send money</Link><Link to="/rates" onClick={()=>setOpen(false)}>Check rates</Link><Link to="/help" onClick={()=>setOpen(false)}>Help</Link>
   <Link className="icon-link" to="/notifications" onClick={()=>setOpen(false)}><Bell/> <span>Notifications</span></Link>
   <Link className="btn btn-primary" to="/register" onClick={()=>setOpen(false)}>Register</Link><Link className="nav-login" to="/login" onClick={()=>setOpen(false)}>Login</Link>
  </nav><button className="menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
 </div></header>
}

function Sidebar(){
 const items=[["Home","/dashboard",Home],["Send money","/send",Send],["Check rates","/rates",Globe2],["Transactions","/transactions",FileText],["Recipients","/recipients",Users],["My profile","/profile",UserCircle],["How money arrives","/payout-methods",WalletCards],["Security","/security",ShieldCheck],["FAQs","/help",HelpCircle],["Cash deposit locations","/locations",MapPin],["Contact Mula-Wave","/contact",Phone],["Admin Console","/admin",Settings]];
 return <aside className="sidebar"><div className="side-inner">{items.map(([n,p,I])=><Link key={p} to={p}><I/>{n}</Link>)}<Link to="/"><LogOut/>Sign out</Link></div></aside>
}

function AppShell({children}){
 return <><Header/><div className="app-shell"><Sidebar/><main className="app-main">{children}</main></div></>
}

function Startup(){return <div className="startup"><div className="startup-card"><div className="logo-big"><span className="brand-mark">MW</span></div><div className="eyebrow">CROSS-BORDER MONEY MOVEMENT</div><h1>Move money with MulaWave.</h1><p>Send money, see your rate before you pay, choose how the recipient receives it, and track the order from one place.</p><div className="stack-actions"><Link className="btn btn-primary btn-lg" to="/register">Register <ArrowRight/></Link><Link className="btn btn-secondary btn-lg" to="/login">Login</Link><Link className="btn btn-outline btn-lg" to="/rates">Check rates</Link></div><Link className="startup-contact" to="/contact">Contact Mula-Wave</Link></div></div>}

function Register(){
 const [step,setStep]=useState(1);
 const [form,setForm]=useState({fullName:"",phone:"",email:"",countryOfResidence:"Zimbabwe",pin:"",confirmPin:""});
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 const labels=["Phone","Identity","Selfie","PIN"];
 const update=(k,v)=>setForm({...form,[k]:v});
 async function finish(){
   setError("");
   if(!form.fullName||!form.phone||!form.pin) return setError("Full name, phone and PIN are required.");
   if(form.pin!==form.confirmPin) return setError("PIN confirmation does not match.");
   setBusy(true);
   try{
     const data=await apiRegister(form);
     setSession(data);
     location.href="/dashboard";
   }catch(e){setError(e.message)}finally{setBusy(false)}
 }
 return <div className="auth-page"><div className="auth-wrap"><Link className="back" to="/"><ArrowLeft/> Back to startup</Link><div className="auth-card">
  <div className="eyebrow">CREATE ACCOUNT · {step}/4</div><div className="progress">{labels.map((x,i)=><span className={i+1<=step?"on":""} key={x}>{x}</span>)}</div>
  {step===1&&<><h1>Verify your phone</h1><p>Enter the mobile number you will use to sign in and receive transaction notifications.</p><label>Full name</label><input className="field" value={form.fullName} onChange={e=>update("fullName",e.target.value)} placeholder="Full name"/><label>Contact number</label><input className="field" value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="+263..."/><label>Email</label><input className="field" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="name@example.com"/></>}
  {step===2&&<Step title="Add your identification document" text="Upload a permitted identity document. The production flow should validate document authenticity and run applicable checks." fields={["Identification document"]} upload/>}
  {step===3&&<Step title="Take your selfie" text="Capture a clear selfie. Production should use an approved identity/liveness verification service." fields={["Selfie"]} upload/>}
  {step===4&&<><h1>Set your login PIN</h1><p>Create a strong PIN. The backend stores only a secure hash.</p><label>PIN</label><input className="field" type="password" value={form.pin} onChange={e=>update("pin",e.target.value)} placeholder="4–8 digits"/><label>Confirm PIN</label><input className="field" type="password" value={form.confirmPin} onChange={e=>update("confirmPin",e.target.value)} placeholder="Confirm PIN"/></>}
  {error&&<div className="notice">{error}</div>}
  <div className="two"><button className="btn btn-secondary" disabled={step===1||busy} onClick={()=>setStep(step-1)}><ArrowLeft/> Back</button>{step<4?<button className="btn btn-primary" onClick={()=>setStep(step+1)}>Next <ArrowRight/></button>:<button className="btn btn-primary" disabled={busy} onClick={finish}>{busy?"Creating…":"Complete registration"} <ArrowRight/></button>}</div>
 </div></div></div>
}
function Step({title,text,fields,upload}){return <><h1>{title}</h1><p>{text}</p>{fields.map(f=><div key={f}><label>{f}</label>{upload?<div className="dropzone"><FileText/><b>Tap to attach</b><small>JPG, PNG or PDF · production limits apply</small></div>:<input className="field" placeholder={f}/>}</div>)}<div className="notice"><ShieldCheck/> Your information is used for identity, security and compliance checks as required.</div></>}

function Login(){
 const [remember,setRemember]=useState(true),[phone,setPhone]=useState(""),[pin,setPin]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const nav=useNavigate();
 async function submit(){
   setError("");setBusy(true);
   try{const data=await apiLogin({phone,pin});setSession(data);if(!remember)localStorage.setItem("mulawave_session_mode","session");nav("/biometric")}
   catch(e){setError(e.message)}finally{setBusy(false)}
 }
 return <div className="auth-page"><div className="auth-wrap"><Link className="back" to="/"><ArrowLeft/> Back to startup</Link><div className="auth-card"><div className="eyebrow">SECURE LOGIN</div><h1>Welcome back.</h1><label>Phone number</label><input className="field" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+263..."/><label>PIN</label><input className="field" type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="••••••"/><label className="check"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Remember me</label>{error&&<div className="notice">{error}</div>}<button className="btn btn-primary full" disabled={busy} onClick={submit}>{busy?"Signing in…":"Login"} <ArrowRight/></button><Link className="auth-link" to="/security">Forgot your PIN?</Link><Link className="btn btn-outline full" to="/rates">Check rates</Link><Link className="auth-link" to="/contact">Contact Mula-Wave</Link></div></div></div>
}
function Biometric(){
 const nav=useNavigate(); const user=getSessionUser();
 return <div className="auth-page"><div className="auth-wrap"><div className="auth-card center"><div className="biometric"><Smartphone/></div><div className="eyebrow">DEVICE SECURITY</div><h1>Confirm your device.</h1><p>{user?.fullName ? `Signed in as ${user.fullName}.` : "Confirm the trusted device before continuing."}</p><button className="btn btn-primary full" onClick={()=>nav("/dashboard")}>Continue securely <ShieldCheck/></button><button className="auth-link" onClick={()=>{clearSession();nav("/login")}}>Sign out</button></div></div></div>
}
function Dashboard(){return <AppShell><div className="container page"><div className="page-top"><div><div className="eyebrow">HOME</div><h1>Your MulaWave dashboard</h1><p>Manage transfers, recipients, rates and account security.</p></div><Link className="btn btn-primary" to="/send">Send money <ArrowRight/></Link></div><div className="dashboard-grid"><div className="balance"><span>Wallet / transfer float</span><b>Transfer float</b><small>Balance authority will come from the production ledger.</small><Link className="btn btn-secondary" to="/rates">Check rates</Link></div><div className="mini"><span>Verification</span><b className="success">Verified</b><p>Identity and selfie checks complete.</p></div><div className="mini"><span>Notifications</span><b>3 unread</b><Link to="/notifications">View notifications</Link></div></div><h2>Quick actions</h2><div className="cards-3"><Quick icon={<Send/>} title="Send money" text="Create a new transfer order." to="/send"/><Quick icon={<FileText/>} title="Transactions" text="View current and historical orders." to="/transactions"/><Quick icon={<Users/>} title="Recipients" text="Add, edit or remove recipients." to="/recipients"/></div></div></AppShell>}
function Quick({icon,title,text,to}){return <Link className="feature-card" to={to}><div className="icon-box">{icon}</div><h3>{title}</h3><p>{text}</p><ChevronRight/></Link>}

function Rates(){
 const [country,setCountry]=useState("India"),[method,setMethod]=useState("Bank account"),[bank,setBank]=useState(banks[0]),[amount,setAmount]=useState("500");
 const rate=87.5, fee=(Number(amount)||0)*.05, receive=Math.max(0,(Number(amount)||0)-fee)*rate;
 return <AppShell><div className="container page"><div className="eyebrow">CHECK RATES</div><h1>See what your recipient gets.</h1><p className="lead narrow">Select the destination and payout method first. The backend should return the authoritative rate, fee, limits and quote expiry.</p><div className="rate-flow"><section className="panel"><h2>1. Select country</h2><div className="choice-grid">{countries.map(c=><button className={country===c.name?"choice-card selected":"choice-card"} onClick={()=>setCountry(c.name)} key={c.name}><Globe2/><b>{c.name}</b><small>{c.currency}</small></button>)}</div><h2>2. How should the recipient receive it?</h2><div className="choice-grid two-cols"><button className={method==="Cash"?"choice-card selected":"choice-card"} onClick={()=>setMethod("Cash")}><Banknote/><b>Cash</b><small>Cash collection where enabled</small></button><button className={method==="Bank account"?"choice-card selected":"choice-card"} onClick={()=>setMethod("Bank account")}><Landmark/><b>Bank account</b><small>Direct account payout where enabled</small></button></div>{method==="Bank account"&&<><label>Recipient bank</label><select className="field" value={bank} onChange={e=>setBank(e.target.value)}>{banks.map(b=><option key={b}>{b}</option>)}</select></>}<h2>3. Enter USD amount</h2><div className="money-input large"><input value={amount} onChange={e=>setAmount(e.target.value)}/><b>USD</b></div></section><aside className="quote-result"><span>Indicative quote</span><h3>{amount||0} USD → {country}</h3><div><span>Fee</span><b>5%</b></div><div><span>Rate</span><b>1 USD = {rate} INR</b></div><div className="receive"><span>Recipient gets</span><b>₹{receive.toLocaleString(undefined,{maximumFractionDigits:2})}</b></div><small>Illustrative rate. Production quote must come from the server and be locked to the order.</small><Link className="btn btn-primary full" to={`/send?country=${country}&method=${method}&bank=${encodeURIComponent(bank)}&amount=${amount}`}>Calculate & continue <ArrowRight/></Link></aside></div></div></AppShell>
}

function SendMoney(){
 const [items,setItems]=useState([]),[selected,setSelected]=useState(""),[amount,setAmount]=useState("500"),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const nav=useNavigate();
 React.useEffect(()=>{getRecipients().then(setItems).catch(e=>setError(e.message))},[]);
 async function submit(){
   const r=items.find(x=>x._id===selected); if(!r)return setError("Select a recipient.");
   setBusy(true);setError("");
   try{
     const amt=Number(amount),fee=amt*.05,rate=87.5,recipientAmount=(amt-fee)*rate;
     const order=await createOrder({recipientId:r._id,sourceCountry:"Zimbabwe",destinationCountry:r.countryCode==="ZW"?"Zimbabwe":r.countryCode==="IN"?"India":"South Africa",destinationCurrency:r.currency||"INR",amount:amt,fee,exchangeRate:rate,recipientAmount,paymentMethod:r.payoutMethod});
     nav(`/order/${encodeURIComponent(order.orderNumber)}`);
   }catch(e){setError(e.message)}finally{setBusy(false)}
 }
 return <AppShell><div className="container page"><div className="eyebrow">SEND MONEY</div><h1>Choose a recipient.</h1><p className="lead narrow">Recipient records come from MongoDB. The quote values below remain illustrative until a server-side quote service is connected.</p>{error&&<div className="notice">{error}</div>}<div className="recipient-select">{items.map(r=><button className={selected===r._id?"recipient-row selected":"recipient-row"} key={r._id} onClick={()=>setSelected(r._id)}><span className="avatar">{(r.fullName||"R").split(" ").map(x=>x[0]).slice(0,2).join("")}</span><div><b>{r.fullName}</b><small>{r.countryCode} · {r.payoutMethod} · {r.bankName||"—"}</small></div><ArrowRight/></button>)}{!items.length&&<Link className="btn btn-secondary full" to="/recipients">Add your first recipient</Link>}{items.length>0&&<><label>Amount in USD</label><div className="money-input large"><input value={amount} onChange={e=>setAmount(e.target.value)}/><b>USD</b></div><button className="btn btn-primary full" disabled={busy||!selected} onClick={submit}>{busy?"Creating order…":"Create transfer order"} <ArrowRight/></button></>}<Link className="btn btn-secondary full" to="/recipients">Manage recipients</Link></div></div></AppShell>
}
function Recipients(){
 const [items,setItems]=useState([]),[busy,setBusy]=useState(true),[error,setError]=useState(""),[form,setForm]=useState(null);
 async function load(){try{setBusy(true);setItems(await getRecipients())}catch(e){setError(e.message)}finally{setBusy(false)}}
 React.useEffect(()=>{load()},[]);
 async function save(){
   try{await createRecipient(form);setForm(null);load()}catch(e){setError(e.message)}
 }
 return <AppShell><div className="container page"><div className="page-top"><div><div className="eyebrow">RECIPIENTS</div><h1>Your recipients</h1><p>Recipients are stored in MongoDB against your authenticated account.</p></div><button className="btn btn-primary" onClick={()=>setForm({fullName:"",phone:"",countryCode:"IN",payoutMethod:"bank",bankName:"",accountName:"",accountNumber:"",currency:"INR"})}>Add recipient <ArrowRight/></button></div>
 {error&&<div className="notice">{error}</div>}{form&&<div className="panel"><h2>New recipient</h2><div className="settings-form"><label>Full name</label><input className="field" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/><label>Phone</label><input className="field" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><label>Country code</label><input className="field" value={form.countryCode} onChange={e=>setForm({...form,countryCode:e.target.value})}/><label>Payout method</label><select className="field" value={form.payoutMethod} onChange={e=>setForm({...form,payoutMethod:e.target.value})}><option value="bank">Bank</option><option value="cash">Cash</option><option value="wallet">Wallet</option></select><label>Bank name</label><input className="field" value={form.bankName} onChange={e=>setForm({...form,bankName:e.target.value})}/><label>Account name</label><input className="field" value={form.accountName} onChange={e=>setForm({...form,accountName:e.target.value})}/><label>Account number</label><input className="field" value={form.accountNumber} onChange={e=>setForm({...form,accountNumber:e.target.value})}/><div className="two"><button className="btn btn-secondary" onClick={()=>setForm(null)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save recipient</button></div></div></div>}
 <div className="recipient-list">{busy?<div className="panel">Loading recipients…</div>:items.length?items.map(r=><div className="recipient-row" key={r._id}><span className="avatar">{(r.fullName||"R").split(" ").map(x=>x[0]).slice(0,2).join("")}</span><div><b>{r.fullName}</b><small>{r.countryCode} · {r.payoutMethod} · {r.bankName||"—"}</small></div><button className="btn btn-secondary" onClick={async()=>{await deleteRecipient(r._id);load()}}>Delete</button></div>):<div className="panel">No recipients yet.</div>}</div></div></AppShell>
}
function Recipient({name,phone,method,bank}){return <div className="recipient-row"><span className="avatar">{name.split(" ").map(x=>x[0]).join("")}</span><div><b>{name}</b><small>{phone} · {method} · {bank}</small></div><button className="btn btn-secondary">Edit</button><button className="btn btn-outline">Delete</button></div>}

function Transactions(){
 const [orders,setOrders]=useState([]),[error,setError]=useState("");
 React.useEffect(()=>{getOrders().then(setOrders).catch(e=>setError(e.message))},[]);
 return <AppShell><div className="container page"><div className="eyebrow">TRANSACTIONS</div><h1>Current & history</h1>{error&&<div className="notice">{error}</div>}<div className="table"><div className="tr head"><span>Order</span><span>Recipient</span><span>Amount</span><span>Status</span></div>{orders.map(o=><Link className="tr" key={o._id} to={`/order/${encodeURIComponent(o.orderNumber)}`}><span>{o.orderNumber}</span><span>{o.recipient?.fullName||"—"}</span><span>USD {Number(o.amount).toFixed(2)}</span><span className="pill processing">{o.status}</span></Link>)}{!orders.length&&!error&&<div className="panel">No orders found.</div>}</div></div></AppShell>
}
function Order(){return <AppShell><div className="container page"><div className="eyebrow">ORDER</div><h1>MW-20260904-00127</h1><div className="order-grid"><div className="panel"><div className="status-banner"><CheckCircle2/><div><b>Payment received</b><span>Compliance and payout processing is in progress.</span></div></div><div className="timeline"><Timeline done t="Order created"/><Timeline done t="Payment received"/><Timeline active t="Compliance review / payout processing"/><Timeline t="Recipient paid"/></div></div><div className="panel"><h3>Order data</h3><div className="review"><span>Amount<b>USD 500.00</b></span><span>Recipient<b>Tariro Moyo</b></span><span>Payout<b>Bank account</b></span><span>Reference<b>MW-20260904-00127</b></span></div></div></div></div></AppShell>}
function Timeline({done,active,t}){return <div className={"timeline-item "+(done?"done ":"")+(active?"active":"")}><span>{done?<CheckCircle2/>:<i className="dot"/>}</span><b>{t}</b></div>}

function Generic({title,eyebrow,children}){return <AppShell><div className="container page"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{children||<div className="panel"><p>Page framework ready for production content and backend integration.</p></div>}</div></AppShell>}

function Notifications(){return <Generic eyebrow="NOTIFICATIONS" title="Notifications"><div className="notification-list"><div><Bell/><b>Transfer payment received</b><span>MW-20260904-00127 is moving to the next stage.</span></div><div><ShieldCheck/><b>Verification complete</b><span>Your identity verification has been completed.</span></div><div><Clock3/><b>Rate reminder</b><span>Your previous quote has expired. Create a new quote before sending.</span></div></div></Generic>}
function Profile(){return <Generic eyebrow="MY PROFILE" title="My profile"><div className="profile-card"><label>Full name</label><input className="field" value="Kudakwashe Kamutando" readOnly/><label>Cell phone</label><input className="field" value="+263 7X XXX XXXX" readOnly/><label>Account status</label><div className="status-inline"><CheckCircle2/> Verified</div></div></Generic>}
function Security(){return <Generic eyebrow="SECURITY" title="Account security"><div className="cards-3"><Quick icon={<LockKeyhole/>} title="Change PIN" text="Update your login PIN securely." to="/security"/><Quick icon={<Smartphone/>} title="Biometrics" text="Manage supported device biometric authentication." to="/security"/><Quick icon={<ShieldCheck/>} title="Sessions" text="Review active devices and sessions." to="/security"/></div></Generic>}
function PayoutMethods(){return <Generic eyebrow="HOW MONEY ARRIVES" title="Choose the payout method"><div className="cards-3"><Feature icon={<Banknote/>} title="Cash" text="Recipient collects cash at an enabled payout location after required verification."/><Feature icon={<Landmark/>} title="Bank account" text="Funds are paid to the recipient's eligible bank account using verified account details."/></div></Generic>}
function Feature({icon,title,text}){return <div className="feature-card"><div className="icon-box">{icon}</div><h3>{title}</h3><p>{text}</p></div>}
function Help(){return <Generic eyebrow="FAQS" title="Frequently asked questions"><div className="faq-grid">{["How do I register?","Which documents are accepted?","How do I pay for an order?","How long does payout take?","How do I change my PIN?","Why is my transfer under review?"].map(q=><div className="faq" key={q}><HelpCircle/><b>{q}</b><p>Answer content should be managed from the approved MulaWave knowledge base.</p></div>)}</div></Generic>}
function Locations(){return <Generic eyebrow="CASH DEPOSIT LOCATIONS" title="Find a MulaWave cash point"><div className="location-card"><MapPin/><div><b>Location search</b><p>Production version should retrieve authorised cash-in locations from the backend with opening hours, status and partner information.</p></div><button className="btn btn-primary">Use location search</button></div></Generic>}
function Contact(){return <Generic eyebrow="CONTACT MULA-WAVE" title="We are here to help"><div className="contact-grid"><div className="panel"><Phone/><h3>Customer support</h3><p>Use the official support channel configured for your market.</p></div><div className="panel"><HelpCircle/><h3>Transfer support</h3><p>Have your order number ready when contacting support.</p></div></div></Generic>}


function Admin(){
 const [section,setSection]=useState("overview"),[overview,setOverview]=useState(null),[users,setUsers]=useState([]),[audit,setAudit]=useState([]),[settings,setSettings]=useState([]),[orders,setOrders]=useState([]),[error,setError]=useState("");
 const nav=[["overview","Overview"],["users","Admin users"],["roles","Roles & permissions"],["customers","Customers"],["kyc","KYC / AML"],["orders","Orders"],["ledger","Ledger"],["payments","Payments & payouts"],["treasury","Treasury"],["reconciliation","Reconciliation"],["corridors","Countries & corridors"],["rates","Rates & fees"],["notifications","Notifications"],["security","Security"],["audit","Audit logs"],["system","System settings"]];
 async function load(){
   try{
     const [o,u,a,s,os]=await Promise.all([adminOverview(),adminUsers(),adminAudit(),adminSettings(),getOrders()]);
     setOverview(o);setUsers(u);setAudit(a);setSettings(s);setOrders(os);setError("");
   }catch(e){setError(e.message)}
 }
 React.useEffect(()=>{load()},[]);
 return <AppShell><div className="container page admin-page">
  <div className="admin-header"><div><div className="eyebrow">ADMIN CONSOLE</div><h1>Global control centre</h1><p>Live records are loaded through the protected backend API.</p></div><span className="admin-badge"><ShieldCheck/> Privileged access</span></div>
  {error&&<div className="notice">{error} — your account may not have an admin role.</div>}
  <div className="admin-layout"><div className="admin-menu">{nav.map(([id,label])=><button className={section===id?"active":""} onClick={()=>setSection(id)} key={id}>{label}</button>)}</div>
  <div className="admin-content">
   {section==="overview"&&<div className="admin-cards">{[["Customers",overview?.customers??"—","MongoDB users"],["Pending KYC",overview?.pendingKyc??"—","Requires review"],["Orders",overview?.orders??"—","All orders"],["Paid",overview?.paid??"—","Completed payouts"]].map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small></div>)}</div>}
   {section==="users"&&<AdminLiveUsers users={users} reload={load}/>}
   {section==="roles"&&<AdminRolesLive users={users} reload={load}/>}
   {section==="customers"&&<AdminTable title="Customer database" cols={["ID","Name","Phone","KYC","Role","Status"]} rows={users.filter(u=>u.role==="customer").map(u=>[String(u._id).slice(-8),u.fullName,u.phone,u.kycStatus,u.role,u.status])}/>}
   {section==="orders"&&<AdminTable title="Orders" cols={["Order","Customer","Amount","Payout","Status"]} rows={orders.map(o=>[o.orderNumber,o.customer?.fullName||"—",`USD ${o.amount}`,o.recipient?.payoutMethod||"—",o.status])}/>}
   {section==="audit"&&<AdminTable title="Audit logs" cols={["Time","Actor","Action","Resource","Reason"]} rows={audit.map(a=>[new Date(a.createdAt).toLocaleString(),a.actor?.fullName||"—",a.action,a.resource,a.reason||"—"])}/>}
   {section==="rates"&&<LiveSettings title="Rates & fees" keys={["defaultFee","quoteExpiry","baseCurrency"]} settings={settings} reload={load}/>}
   {section==="system"&&<LiveSettings title="System settings" keys={["kycMode","requireBiometric","maintenance"]} settings={settings} reload={load}/>}
   {section==="kyc"&&<AdminTable title="KYC / AML" cols={["Customer","KYC status","Role","Status"]} rows={users.map(u=>[u.fullName,u.kycStatus,u.role,u.status])}/>}
   {section==="ledger"&&<div className="panel"><h2>Ledger</h2><p>MongoDB is not being used as an editable customer-balance ledger. Build the production double-entry ledger before processing real money.</p></div>}
   {section==="payments"&&<AdminTable title="Payments & payouts" cols={["Order","Customer","Amount","Status"]} rows={orders.map(o=>[o.orderNumber,o.customer?.fullName||"—",`USD ${o.amount}`,o.status])}/>}
   {["treasury","reconciliation","corridors","notifications","security"].includes(section)&&<ConfigPanel title={nav.find(x=>x[0]===section)?.[1]||section} items={["Backend-controlled configuration","Audit logging","Role restrictions"]} note="Connect this module to a dedicated backend collection/provider adapter before production."/>}
  </div></div>
 </div></AppShell>
}
function AdminLiveUsers({users,reload}){
 return <div className="panel"><div className="admin-panel-head"><div><h2>Users</h2><p>Live users from MongoDB.</p></div></div><div className="admin-user-list">{users.map(u=><div className="admin-user" key={u._id}><div><b>{u.fullName}</b><small>{u.phone} · {u.email||"No email"}</small></div><span className="pill success-pill">{u.role}</span></div>)}</div></div>
}
function AdminRolesLive({users,reload}){
 async function change(id,role){
   try{await assignRole(id,role,"Admin console role assignment");await reload()}catch(e){alert(e.message)}
 }
 const roles=["customer","operations","finance","compliance","support","auditor","super_admin"];
 return <div className="panel"><div className="admin-panel-head"><div><h2>Roles & permissions</h2><p>Only a Super Admin can change roles in the current backend.</p></div></div><div className="admin-user-list">{users.map(u=><div className="admin-user" key={u._id}><div><b>{u.fullName}</b><small>{u.phone}</small></div><select value={u.role} onChange={e=>change(u._id,e.target.value)}>{roles.map(r=><option key={r}>{r}</option>)}</select></div>)}</div></div>
}
function LiveSettings({title,keys,settings,reload}){
 const map=Object.fromEntries(settings.map(s=>[s.key,s.value]));
 const [vals,setVals]=useState(map);
 React.useEffect(()=>setVals(map),[settings]);
 async function save(key){try{await updateSetting(key,vals[key],"Admin console configuration change");await reload()}catch(e){alert(e.message)}}
 return <div className="panel"><h2>{title}</h2><div className="settings-form">{keys.map(k=><div key={k}><label>{k}</label><input className="field" value={vals[k]??""} onChange={e=>setVals({...vals,[k]:e.target.value})}/><button className="btn btn-primary" onClick={()=>save(k)}>Save {k}</button></div>)}</div></div>
}
function AdminOverview(){
 return <><div className="admin-cards"><div><span>Customers</span><b>12,482</b><small>All account statuses</small></div><div><span>Orders today</span><b>347</b><small>Across enabled corridors</small></div><div><span>AML alerts</span><b>14</b><small>3 high priority</small></div><div><span>Reconciliation</span><b>98.7%</b><small>Matched today</small></div></div><div className="panel"><h2>Administrative control model</h2><p>The console exposes operational records while keeping sensitive actions behind permissions, MFA, validation and audit logging.</p><div className="admin-control-grid">{["View customer records","Approve KYC","Review AML alerts","Manage orders","Manage ledger visibility","Reconcile payments","Manage treasury","Change rates & fees","Configure corridors","Assign roles","Manage notifications","View audit logs"].map(x=><div key={x}><CheckCircle2/>{x}</div>)}</div></div></>
}

function AdminTable({title,cols,rows}){
 return <div className="panel admin-table-panel"><div className="admin-panel-head"><h2>{title}</h2><button className="btn btn-secondary">Export</button></div><div className="table admin-table"><div className="tr head">{cols.map(c=><span key={c}>{c}</span>)}</div>{rows.map((r,i)=><div className="tr" key={i}>{r.map((x,j)=><span key={j}>{x}</span>)}</div>)}</div></div>
}

function AdminUsers({users,setUsers}){
 const [role,setRole]=useState("Customer Support");
 return <div className="panel"><div className="admin-panel-head"><div><h2>Admin users</h2><p>Create staff accounts and assign controlled roles.</p></div><button className="btn btn-primary">Invite admin</button></div><div className="admin-user-list">{users.map((u,i)=><div className="admin-user" key={u.email}><div><b>{u.name}</b><small>{u.email}</small></div><select value={u.role} onChange={e=>{const a=[...users];a[i]={...u,role:e.target.value};setUsers(a)}}><option>Super Administrator</option><option>Compliance Officer</option><option>Finance Officer</option><option>Operations Manager</option><option>Customer Support</option><option>Auditor</option></select><span className="pill success-pill">{u.status}</span></div>)}</div><div className="notice"><ShieldCheck/> Role changes must be audited and should require sufficient privilege. A user should never grant themselves additional permissions.</div></div>
}

function AdminRoles({roles,setRoles}){
 const [selected,setSelected]=useState(roles[0].name);
 const permissions={
 "Super Administrator":["All modules","System configuration","Role assignment","Audit"],
 "Compliance Officer":["KYC","AML","Sanctions","PEP","Source of funds"],
 "Finance Officer":["Ledger read","Reconciliation","Treasury","Settlements"],
 "Operations Manager":["Orders","Payments","Payouts","Branches"],
 "Customer Support":["Customers read","Orders read","Support"],
 "Auditor":["Read-only reports","Audit logs","Reconciliation read"]
 };
 return <div className="roles-layout"><div className="panel role-list"><div className="admin-panel-head"><h2>Roles</h2><button className="btn btn-primary">Create role</button></div>{roles.map(r=><button className={selected===r.name?"role-select active":"role-select"} onClick={()=>setSelected(r.name)} key={r.name}><b>{r.name}</b><small>{r.scope}</small></button>)}</div><div className="panel"><div className="admin-panel-head"><div><h2>{selected}</h2><p>Permissions assigned to this role.</p></div><button className="btn btn-primary">Save permissions</button></div><div className="permission-grid">{(permissions[selected]||[]).map(p=><label className="permission" key={p}><input type="checkbox" defaultChecked/><span><b>{p}</b><small>Controlled by RBAC and audit logging.</small></span></label>)}</div><div className="notice"><ShieldCheck/> Production role assignment should require MFA/step-up authentication, enforce separation of duties and create an audit event.</div></div></div>
}

function ConfigPanel({title,items,note}){return <div className="panel"><div className="admin-panel-head"><div><h2>{title}</h2><p>{note}</p></div><button className="btn btn-primary">Add</button></div><div className="config-list">{items.map((x,i)=><div key={x}><b>{x}</b><span className="pill success-pill">Enabled</span><button className="btn btn-secondary">Edit</button></div>)}</div></div>}

function RateSettings({settings,setSettings,saved,setSaved}){
 return <div className="panel"><h2>Rates & fees</h2><p>Production rates must be controlled server-side and versioned. Every quote stores the exact rate and fee rule used.</p><div className="settings-form"><label>Default transfer fee %</label><input className="field" value={settings.defaultFee} onChange={e=>setSettings({...settings,defaultFee:e.target.value})}/><label>Quote expiry minutes</label><input className="field" value={settings.quoteExpiry} onChange={e=>setSettings({...settings,quoteExpiry:e.target.value})}/><label>Base currency</label><select className="field" value={settings.baseCurrency} onChange={e=>setSettings({...settings,baseCurrency:e.target.value})}><option>USD</option><option>ZAR</option><option>INR</option></select><button className="btn btn-primary" onClick={()=>setSaved(true)}>Save configuration</button>{saved&&<div className="notice"><CheckCircle2/> Configuration saved to the administrative workflow in this prototype.</div>}</div></div>
}
function SystemSettings({settings,setSettings,saved,setSaved}){
 return <div className="panel"><h2>System settings</h2><div className="settings-form"><label>KYC processing mode</label><select className="field" value={settings.kycMode} onChange={e=>setSettings({...settings,kycMode:e.target.value})}><option>Manual + automated checks</option><option>Automated first, manual exceptions</option></select><label>Require biometric step-up</label><select className="field" value={settings.requireBiometric} onChange={e=>setSettings({...settings,requireBiometric:e.target.value})}><option>Yes</option><option>No</option></select><label>Maintenance mode</label><select className="field" value={settings.maintenance} onChange={e=>setSettings({...settings,maintenance:e.target.value})}><option>No</option><option>Yes</option></select><button className="btn btn-primary" onClick={()=>setSaved(true)}>Save system settings</button>{saved&&<div className="notice"><CheckCircle2/> Settings saved in prototype state. Production persistence must go through authorised backend APIs.</div>}</div></div>
}

function App(){return <Routes><Route path="/" element={<Startup/>}/><Route path="/register" element={<Register/>}/><Route path="/login" element={<Login/>}/><Route path="/biometric" element={<Biometric/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/send" element={<SendMoney/>}/><Route path="/rates" element={<Rates/>}/><Route path="/recipients" element={<Recipients/>}/><Route path="/transactions" element={<Transactions/>}/><Route path="/order/:id" element={<Order/>}/><Route path="/notifications" element={<Notifications/>}/><Route path="/profile" element={<Profile/>}/><Route path="/security" element={<Security/>}/><Route path="/payout-methods" element={<PayoutMethods/>}/><Route path="/help" element={<Help/>}/><Route path="/locations" element={<Locations/>}/><Route path="/contact" element={<Contact/>}/><Route path="/admin" element={<Admin/>}/></Routes>}
createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);
