import { Toaster, toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch, Link, useLocation, useRoute } from "wouter";
import { startLogin } from "./const";
import { useAuth } from "./_core/hooks/useAuth";
import { trpc } from "./lib/trpc";
import {
  ArrowRight, Backpack, BookOpen, Building2, CalendarDays, Camera, Check, ChevronLeft, CircleHelp,
  Clock3, Filter, ImagePlus, KeyRound, LogOut, Mail, MapPin, Menu, Package, PenLine, Phone,
  Plus, Search, SlidersHorizontal, Sparkles, UserRound, Watch, X
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

type Kind = "lost" | "found";
type Status = "open" | "returned";
type Item = {
  id: number; title: string; description: string; category: string; kind: Kind; building: string; floor: string; room: string;
  occurredAt: Date | string; status: Status; images?: string[]; contactNote?: string | null; authorName?: string | null; authorEmail?: string | null;
};

const sampleItems: Item[] = [
  { id: 101, title: "Caneta preta", description: "Caneta encontrada perto da biblioteca. Tem uma pequena marca azul na tampa.", category: "Caneta", kind: "found", building: "Prédio 5", floor: "3º andar", room: "Sala 504", occurredAt: "2026-06-25", status: "open", images: ["/manus-storage/async-images/VnK2FE12SlsFo2Vx43VCxN/image-2.webp"] },
  { id: 102, title: "Caderno espiral", description: "Caderno de capa clara com anotações de engenharia de software.", category: "Caderno", kind: "lost", building: "Prédio 5", floor: "3º andar", room: "Sala 504", occurredAt: "2026-06-25", status: "open", images: ["/manus-storage/async-images/VnK2FE12SlsFo2Vx43VCxN/image-3.webp"] },
  { id: 103, title: "Livro de cálculo", description: "Livro aberto encontrado sobre uma mesa no bloco de estudos.", category: "Livro", kind: "found", building: "Prédio 3", floor: "2º andar", room: "Sala 202", occurredAt: "2026-06-24", status: "open", images: ["/manus-storage/async-images/VnK2FE12SlsFo2Vx43VCxN/image-1.webp"] },
  { id: 104, title: "Mochila amarela", description: "Mochila amarela com bolso frontal e chaveiro pequeno.", category: "Mochila", kind: "lost", building: "Prédio 3", floor: "2º andar", room: "Sala 202", occurredAt: "2026-06-25", status: "open", images: ["/assets/mochila-amarela.jpg", "/assets/mochila-frontal.jpg", "/assets/mochila-aberta.jpg"] },
];
const categories = ["Caneta", "Caderno", "Livro", "Mochila", "Documento", "Eletrônico", "Chaves", "Outros"];
const buildings = ["Prédio 1", "Prédio 2", "Prédio 3", "Prédio 5"];

function iconForCategory(category: string, size = 54) {
  const props = { size, strokeWidth: 1.5 };
  if (category.toLowerCase().includes("mochila")) return <Backpack {...props} />;
  if (category.toLowerCase().includes("livro")) return <BookOpen {...props} />;
  if (category.toLowerCase().includes("caneta")) return <PenLine {...props} />;
  if (category.toLowerCase().includes("relógio")) return <Watch {...props} />;
  return <Package {...props} />;
}
function formatDate(value: Date | string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function itemImages(item: Item) { return item.images?.filter(Boolean) ?? []; }

function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={compact ? "brand brand-compact" : "brand"}>
    <span className="brand-mark"><span /><span /></span>
    <span><b>LOST</b><b>AND FOUND</b></span>
  </Link>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, navigate] = useLocation();
  const doLogout = async () => { await logout(); toast.success("Você saiu da sua conta."); navigate("/"); };
  return <div className="app-shell">
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className={mobileOpen ? "main-nav open" : "main-nav"}>
          <Link href="/localizar" onClick={() => setMobileOpen(false)}><Search size={16} /> Localizar</Link>
          <Link href="/novo" onClick={() => setMobileOpen(false)}><Plus size={16} /> Novo</Link>
          <Link href="/localizar?kind=lost" onClick={() => setMobileOpen(false)}>Desaparecido</Link>
          <Link href={isAuthenticated ? "/perfil" : "/login"} onClick={() => setMobileOpen(false)}><UserRound size={16} /> Perfil</Link>
        </nav>
        <div className="header-actions">
          {isAuthenticated ? <button className="avatar-button" onClick={() => navigate("/perfil")} title={user?.name ?? "Perfil"}><img src="/assets/perfil-gabriel.jpg" alt="" /></button> : <><button className="header-login" onClick={() => navigate("/login")}>Entrar</button><Link className="header-signup" href="/cadastro">Cadastrar</Link></>}
          <button className="mobile-menu" onClick={() => setMobileOpen(v => !v)} aria-label="Abrir menu">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
    <main>{children}</main>
    <nav className="bottom-nav">
      <Link href="/"><Sparkles size={18} />Início</Link>
      <Link href="/localizar"><Search size={18} />Localizar</Link>
      <Link href="/novo" className="bottom-add"><Plus size={22} /></Link>
      <Link href={isAuthenticated ? "/perfil" : "/login"}><UserRound size={18} />Perfil</Link>
    </nav>
    <footer className="site-footer"><div><Brand compact /><span>Uma comunidade que ajuda a devolver o que importa.</span></div><span>© {new Date().getFullYear()} Faculdade Lost & Found</span></footer>
  </div>;
}

function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "", registration: "" });
  const [busy, setBusy] = useState(false);
  const launchLogin = () => {
    setBusy(true);
    try { startLogin(); } catch { setBusy(false); toast.error("O login ainda não está configurado neste ambiente."); }
  };
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (mode === "signup" && form.name.trim().length < 3) return toast.error("Digite seu nome completo."); if (!form.email.includes("@")) return toast.error("Digite um e-mail válido."); launchLogin(); };
  return <div className="auth-screen">
    <div className="auth-side"><Brand /><div className="auth-poster"><div className="poster-word">LOST<br /><span>AND FOUND</span></div><div className="poster-art"><PenLine size={48} /><span>+</span><BookOpen size={54} /><Package size={66} /><Backpack size={56} /></div><div className="poster-line" /></div><p>O que foi perdido pode voltar para casa.</p></div>
    <div className="auth-panel"><Link href="/" className="back-link"><ChevronLeft size={18} /> voltar para o início</Link><div className="auth-card"><div className="auth-heading"><span className="eyebrow">Comunidade da faculdade</span><h1>{mode === "login" ? "Entre na sua conta" : "Cadastre-se"}</h1><p>{mode === "login" ? "Acompanhe seus anúncios e encontre o que procura." : "Faça parte da rede que ajuda a devolver cada item."}</p></div>
      <form onSubmit={submit} className="form-stack">
        {mode === "signup" && <label>Nome completo<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Seu nome completo" /></label>}
        <label>E-mail pessoal<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" /></label>
        {mode === "signup" && <label>Matrícula<input value={form.registration} onChange={e => setForm({ ...form, registration: e.target.value })} placeholder="Sua matrícula" /></label>}
        <label>Senha<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></label>
        <button className="primary-button wide" disabled={busy}>{busy ? "Abrindo acesso..." : mode === "login" ? "Entrar" : "Continuar"}<ArrowRight size={18} /></button>
      </form>
      <p className="auth-helper">Seus dados ficam vinculados ao e-mail pessoal informado.</p>
      <div className="auth-links">{mode === "login" ? <><button onClick={() => navigate("/recuperar-senha")}>Esqueci a senha</button><span>Não tem conta?</span><button onClick={() => navigate("/cadastro")}>Cadastre-se</button></> : <><span>Já possui uma conta?</span><button onClick={() => navigate("/login")}>Entrar</button></>}</div>
    </div></div>
  </div>;
}
function ShieldIcon() { return <span className="shield-icon">✓</span>; }

function Home() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const itemsQuery = trpc.items.list.useQuery({ status: "open" });
  const items: Item[] = (itemsQuery.data?.length ? itemsQuery.data : sampleItems) as Item[];
  return <AppShell><section className="home-hero"><div className="hero-copy"><span className="eyebrow light">Achados & Perdidos da faculdade</span><h1>O que você<br /><em>perdeu?</em></h1><p>Encontre objetos perdidos no campus ou ajude alguém a reencontrar o que é seu.</p><div className="hero-search"><Search size={20} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="O que você está procurando?" onKeyDown={e => e.key === "Enter" && navigate(`/localizar?q=${encodeURIComponent(search)}`)} /><button onClick={() => navigate(`/localizar?q=${encodeURIComponent(search)}`)}>Pesquisar</button></div><div className="hero-actions"><button className="cream-button" onClick={() => navigate("/localizar")}><Search size={17} /> Localizar um item</button><button className="text-button light-text" onClick={() => navigate("/novo")}>Publicar item <ArrowRight size={16} /></button></div></div><div className="hero-illustration"><div className="hero-ring" /><div className="hero-box"><Package size={120} strokeWidth={1.2} /></div><div className="hero-items"><PenLine /><BookOpen /><Backpack /></div><div className="hero-featured"><span>ITEM EM DESTAQUE</span><img src="/assets/mochila-amarela.jpg" alt="Mochila amarela" /><div><b>Mochila amarela</b><small>Prédio 3 · 2º andar</small></div></div><span className="hero-label">LOST<br /><b>FOUND</b></span></div></section>
    <section className="home-content"><div className="section-intro"><div><span className="eyebrow">A comunidade em movimento</span><h2>Itens recentes</h2><p>Talvez alguém esteja procurando por isso.</p></div><Link href="/localizar" className="outlined-link">Ver todos <ArrowRight size={16} /></Link></div><div className="item-grid">{items.slice(0, 4).map(item => <ItemCard key={item.id} item={item} />)}</div><section className="location-strip"><div><span className="eyebrow light">Procure por onde aconteceu</span><h2>Encontre por prédio</h2><p>Selecione um prédio e veja os itens publicados naquela área.</p></div><div className="building-pills">{buildings.map(building => <button key={building} onClick={() => navigate(`/localizar?building=${encodeURIComponent(building)}`)}>{building}<ArrowRight size={16} /></button>)}</div></section><section className="help-banner"><div className="help-icon"><CircleHelp /></div><div><span className="eyebrow">Viu algo que não é seu?</span><h3>Publique um achado e ajude a comunidade.</h3></div><button className="primary-button" onClick={() => navigate("/novo")}>Publicar item <Plus size={17} /></button></section></section>
  </AppShell>;
}

function ItemCard({ item }: { item: Item }) {
  const [, navigate] = useLocation();
  const images = itemImages(item);
  return <button className="item-card" onClick={() => navigate(`/item/${item.id}`)}><div className={`item-visual category-${item.category.toLowerCase()}`}>{images[0] ? <img src={images[0]} alt="" /> : iconForCategory(item.category)}<span className={item.kind === "found" ? "status-tag found" : "status-tag lost"}>{item.kind === "found" ? "encontrado" : "perdido"}</span></div><div className="item-card-body"><div className="item-title-row"><h3>{item.title}</h3><ArrowRight size={17} /></div><p>{item.description}</p><div className="item-meta"><span><MapPin size={14} />{item.building}, {item.floor}</span><span><CalendarDays size={14} />{formatDate(item.occurredAt)}</span></div></div></button>;
}

function MineItemCard({ item }: { item: Item }) {
  const utils = trpc.useUtils();
  const updateStatus = trpc.items.updateStatus.useMutation({
    onSuccess: () => { toast.success(item.status === "returned" ? "Item reaberto." : "Item marcado como devolvido."); utils.items.mine.invalidate(); utils.items.list.invalidate(); },
    onError: error => toast.error(error.message || "Não foi possível atualizar o status."),
  });
  return <div className="mine-card"><ItemCard item={item} /><button className="mine-status" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: item.id, status: item.status === "returned" ? "open" : "returned" })}><Check size={15} /> {item.status === "returned" ? "Reabrir anúncio" : "Marcar como devolvido"}</button></div>;
}

function LocatePage() {
  const [location, setLocation] = useLocation();
  const queryParams = new URLSearchParams(location.split("?")[1] ?? "");
  const [search, setSearch] = useState(queryParams.get("q") ?? "");
  const [building, setBuilding] = useState(queryParams.get("building") ?? "all");
  const [category, setCategory] = useState("all");
  const [kind, setKind] = useState<"all" | Kind>(queryParams.get("kind") === "lost" ? "lost" : "all");
  const filters = useMemo(() => ({ search: search || undefined, building: building === "all" ? undefined : building, category: category === "all" ? undefined : category, kind: kind === "all" ? undefined : kind, status: "open" as const }), [search, building, category, kind]);
  const itemsQuery = trpc.items.list.useQuery(filters);
  const items: Item[] = (itemsQuery.data ?? []) as Item[];
  const baseItems = items.length ? items : sampleItems;
  const shown = baseItems.filter(item => building === "all" || item.building === building).filter(item => kind === "all" || item.kind === kind).filter(item => category === "all" || item.category === category).filter(item => !search || `${item.title} ${item.description}`.toLowerCase().includes(search.toLowerCase()));
  const updateQuery = (nextBuilding: string) => { setBuilding(nextBuilding); setLocation(`/localizar?${new URLSearchParams({ ...(nextBuilding !== "all" ? { building: nextBuilding } : {}), ...(search ? { q: search } : {}) }).toString()}`); };
  return <AppShell><section className="page-heading"><div><span className="eyebrow">Explore o campus</span><h1>Localizar</h1><p>Encontre um objeto por nome, categoria ou prédio.</p></div><button className="primary-button" onClick={() => window.location.href = "/novo"}><Plus size={17} /> Publicar item</button></section><section className="search-panel"><div className="large-search"><Search size={20} /><input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && setLocation(`/localizar?${new URLSearchParams({ q: search }).toString()}`)} placeholder="O que você perdeu?" /></div><div className="filter-row"><div className="filter-select"><Building2 size={16} /><select value={building} onChange={e => updateQuery(e.target.value)}><option value="all">Todos os prédios</option>{buildings.map(value => <option key={value}>{value}</option>)}</select></div><div className="filter-select"><Package size={16} /><select value={category} onChange={e => setCategory(e.target.value)}><option value="all">Todas as categorias</option>{categories.map(value => <option key={value}>{value}</option>)}</select></div><div className="segmented"><button className={kind === "all" ? "selected" : ""} onClick={() => setKind("all")}>Todos</button><button className={kind === "lost" ? "selected" : ""} onClick={() => setKind("lost")}>Perdidos</button><button className={kind === "found" ? "selected" : ""} onClick={() => setKind("found")}>Achados</button></div></div></section><section className="location-layout"><aside className="building-list"><div className="aside-title"><span className="eyebrow">Mapa rápido</span><h3>Onde procurar?</h3></div>{buildings.map(value => <button key={value} className={building === value ? "building-option selected" : "building-option"} onClick={() => updateQuery(building === value ? "all" : value)}><span className="building-number">{value.replace("Prédio ", "")}</span><span><b>{value}</b><small>Ver itens nesta área</small></span><ArrowRight size={16} /></button>)}<div className="location-note"><MapPin size={17} /><span>Prédios 1, 2, 3 e 5 fazem parte do campus principal.</span></div></aside><div className="results-area"><div className="results-head"><div><span className="eyebrow">Resultados</span><h2>{shown.length} {shown.length === 1 ? "item localizado" : "itens localizados"}</h2></div><button className="filter-icon"><SlidersHorizontal size={17} /> Filtros</button></div>{shown.length ? <div className="item-grid">{shown.map(item => <ItemCard key={item.id} item={item} />)}</div> : <EmptyState title="Nenhum item por aqui" text="Tente ajustar os filtros ou publique um novo anúncio." action="Publicar item" href="/novo" />}</div></section></AppShell>;
}

function NewItemPage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const create = trpc.items.create.useMutation({ onSuccess: result => { toast.success("Item publicado com sucesso!"); navigate(`/item/${result.id}`); }, onError: error => toast.error(error.message || "Não foi possível publicar o item.") });
  const [kind, setKind] = useState<Kind>("lost");
  const [form, setForm] = useState({ title: "", description: "", category: "Mochila", building: "Prédio 3", floor: "2º andar", room: "Sala 202", occurredAt: new Date().toISOString().slice(0, 10), contactNote: "" });
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const setField = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const readFiles = (files: FileList | null) => { if (!files) return; const next = Array.from(files).slice(0, 4).map(file => new Promise<string>(resolve => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); })); Promise.all(next).then(values => setImages(values)); };
  if (!isAuthenticated) return <AppShell><div className="guard-card"><KeyRound size={32} /><span className="eyebrow">Área da comunidade</span><h1>Entre para publicar</h1><p>Você precisa estar conectado para criar um anúncio e conversar sobre a devolução.</p><button className="primary-button" onClick={() => navigate("/login")}>Entrar agora <ArrowRight size={17} /></button></div></AppShell>;
  return <AppShell><section className="page-heading compact-heading"><div><span className="eyebrow">Compartilhe com o campus</span><h1>Publicar item</h1><p>Quanto mais detalhes, mais fácil devolver.</p></div><button className="back-simple" onClick={() => window.history.back()}><ChevronLeft size={17} /> Voltar</button></section><form className="publish-layout" onSubmit={e => { e.preventDefault(); if (form.title.length < 3 || form.description.length < 10) return toast.error("Preencha título e descrição com mais detalhes."); create.mutate({ ...form, kind, images }); }}><div className="publish-main"><div className="form-card"><div className="card-heading"><span className="step">01</span><div><h2>Sobre o item</h2><p>Conte o que foi perdido ou encontrado.</p></div></div><div className="segmented large"><button type="button" className={kind === "lost" ? "selected" : ""} onClick={() => setKind("lost")}>Eu perdi</button><button type="button" className={kind === "found" ? "selected" : ""} onClick={() => setKind("found")}>Eu encontrei</button></div><div className="form-grid"><label className="full">Nome do item<input value={form.title} onChange={e => setField("title", e.target.value)} placeholder="Ex.: Mochila amarela" /></label><label>Categoria<select value={form.category} onChange={e => setField("category", e.target.value)}>{categories.map(value => <option key={value}>{value}</option>)}</select></label><label>Data<input type="date" value={form.occurredAt} onChange={e => setField("occurredAt", e.target.value)} /></label><label className="full">Descrição<textarea value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Descreva cores, marcas, detalhes que ajudem a identificar..." rows={5} /></label></div></div><div className="form-card"><div className="card-heading"><span className="step">02</span><div><h2>Onde aconteceu?</h2><p>Escolha o ponto mais próximo.</p></div></div><div className="form-grid"><label>Prédio<select value={form.building} onChange={e => setField("building", e.target.value)}>{buildings.map(value => <option key={value}>{value}</option>)}</select></label><label>Andar<input value={form.floor} onChange={e => setField("floor", e.target.value)} placeholder="3º andar" /></label><label>Sala / referência<input value={form.room} onChange={e => setField("room", e.target.value)} placeholder="Sala 504" /></label><label>Contato público<input value={form.contactNote} onChange={e => setField("contactNote", e.target.value)} placeholder="Ex.: falar na secretaria" /></label></div></div></div><aside className="publish-side"><div className="form-card photo-card"><div className="card-heading"><span className="step">03</span><div><h2>Fotos</h2><p>Até 4 imagens do item.</p></div></div><button type="button" className="dropzone" onClick={() => fileRef.current?.click()}><ImagePlus size={27} /><b>Adicionar fotos</b><span>JPG ou PNG, até 10MB</span></button><input ref={fileRef} hidden type="file" accept="image/*" multiple onChange={e => readFiles(e.target.files)} />{images.length > 0 && <div className="preview-grid">{images.map((src, index) => <img src={src} key={src} alt={`Prévia ${index + 1}`} />)}</div>}</div><div className="publish-submit"><div><ShieldIcon /><span>Seu contato só aparece para quem abrir este item.</span></div><button className="primary-button wide" disabled={create.isPending}>{create.isPending ? "Publicando..." : "Publicar anúncio"}<ArrowRight size={18} /></button></div></aside></form></AppShell>;
}

function ItemDetailPage() {
  const [, params] = useRoute<{ id: string }>("/item/:id");
  const id = Number(params?.id);
  const itemQuery = trpc.items.byId.useQuery({ id }, { retry: false });
  const item = (itemQuery.data ?? sampleItems.find(sample => sample.id === id)) as Item | undefined;
  const [gallery, setGallery] = useState(0);
  const images = item ? itemImages(item) : [];
  if (itemQuery.isLoading) return <AppShell><LoadingState /></AppShell>;
  if (!item) return <AppShell><EmptyState title="Item não encontrado" text="Este anúncio pode ter sido removido ou já não está disponível." action="Voltar para localizar" href="/localizar" /></AppShell>;
  return <AppShell><div className="detail-wrap"><Link href="/localizar" className="back-link"><ChevronLeft size={18} /> voltar para localizar</Link><div className="detail-layout"><div className="detail-gallery"><div className="detail-image">{images[gallery] ? <img src={images[gallery]} alt={item.title} /> : <>{iconForCategory(item.category, 110)}<span className="detail-stamp">{item.kind === "found" ? "ACHADO" : "PERDIDO"}</span></>}</div>{images.length > 1 && <div className="thumbs">{images.map((image, index) => <button className={gallery === index ? "active" : ""} onClick={() => setGallery(index)} key={image}><img src={image} alt="" /></button>)}</div>}</div><article className="detail-copy"><div className="detail-status"><span className={item.kind === "found" ? "status-tag found" : "status-tag lost"}>{item.kind === "found" ? "encontrado" : "perdido"}</span><span>{item.status === "returned" ? "Devolvido" : "Em aberto"}</span></div><span className="eyebrow">{item.category}</span><h1>{item.title}</h1><p className="detail-description">{item.description}</p><div className="detail-facts"><div><MapPin size={19} /><span><b>Local</b>{item.building}, {item.floor} · {item.room}</span></div><div><CalendarDays size={19} /><span><b>Data</b>{formatDate(item.occurredAt)}</span></div><div><UserRound size={19} /><span><b>Publicado por</b>{item.authorName || "Comunidade da faculdade"}</span></div></div><div className="contact-card"><div className="contact-avatar">{(item.authorName ?? "C").slice(0, 1)}</div><div><span className="eyebrow">Quer devolver este item?</span><h3>Entre em contato com {item.authorName || "o anunciante"}.</h3>{item.contactNote && <p>{item.contactNote}</p>}</div><a className="primary-button" href={`mailto:${item.authorEmail ?? ""}?subject=${encodeURIComponent(`Sobre o item: ${item.title}`)}`}><Mail size={17} /> Contato</a></div></article></div></div></AppShell>;
}

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const itemsQuery = trpc.items.mine.useQuery(undefined, { enabled: isAuthenticated });
  const update = trpc.profile.update.useMutation({ onSuccess: () => { toast.success("Perfil atualizado."); navigate("/perfil"); } });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  if (!isAuthenticated) return <AppShell><div className="guard-card"><UserRound size={32} /><span className="eyebrow">Seu perfil</span><h1>Entre para acompanhar</h1><p>Veja seus anúncios publicados e mantenha seus dados atualizados.</p><button className="primary-button" onClick={() => navigate("/login")}>Entrar agora <ArrowRight size={17} /></button></div></AppShell>;
  const mine = (itemsQuery.data ?? []) as Item[];
  return <AppShell><section className="profile-head"><div className="profile-avatar"><img src="/assets/perfil-gabriel.jpg" alt="Foto do perfil" /></div><div><span className="eyebrow">Meu perfil</span><h1>{user?.name || "Membro da comunidade"}</h1><p>{user?.email || "Conta autenticada"}</p></div><div className="profile-head-actions"><button className="outline-button" onClick={() => setEditing(v => !v)}><PenLine size={16} /> Editar perfil</button><button className="icon-button" title="Sair" onClick={async () => { await logout(); navigate("/"); }}><LogOut size={17} /></button></div></section>{editing && <div className="inline-edit"><input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" /><button className="primary-button" onClick={() => update.mutate({ name })}>Salvar</button></div>}<section className="profile-stats"><div><b>{mine.length}</b><span>Anúncios publicados</span></div><div><b>{mine.filter(i => i.status === "returned").length}</b><span>Itens devolvidos</span></div><div><b>Campus</b><span>Prédio principal</span></div></section><section className="profile-items"><div className="section-intro"><div><span className="eyebrow">Sua atividade</span><h2>Meus anúncios</h2></div><Link href="/novo" className="primary-button"><Plus size={17} /> Novo anúncio</Link></div>{mine.length ? <div className="item-grid">{mine.map(item => <MineItemCard key={item.id} item={item} />)}</div> : <EmptyState title="Você ainda não publicou nada" text="Quando publicar um achado ou uma perda, ele aparecerá aqui." action="Publicar item" href="/novo" />}</section></AppShell>;
}

function RecoveryPage() { const [, navigate] = useLocation(); const [email, setEmail] = useState(""); return <div className="simple-auth"><Brand /><div className="recovery-card"><div className="help-icon"><KeyRound /></div><span className="eyebrow">Acesso seguro</span><h1>Recuperar senha</h1><p>Informe seu e-mail pessoal e enviaremos as instruções de acesso.</p><form onSubmit={e => { e.preventDefault(); if (!email.includes("@")) return toast.error("Digite um e-mail válido."); toast.success("Se este e-mail estiver cadastrado, você receberá as instruções."); }} className="form-stack"><label>E-mail pessoal<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" /></label><button className="primary-button wide">Enviar instruções <ArrowRight size={18} /></button></form><button className="back-link plain" onClick={() => navigate("/login")}><ChevronLeft size={17} /> voltar para o login</button></div></div>; }
function LoadingState() { return <div className="loading-state"><div className="loading-orb" /><p>Carregando item...</p></div>; }
function EmptyState({ title, text, action, href }: { title: string; text: string; action: string; href: string }) { return <div className="empty-state"><Package size={34} /><h2>{title}</h2><p>{text}</p><Link href={href} className="primary-button">{action} <ArrowRight size={17} /></Link></div>; }

function AppRouter() { return <Switch><Route path="/" component={Home} /><Route path="/login"><AuthPage mode="login" /></Route><Route path="/cadastro"><AuthPage mode="signup" /></Route><Route path="/recuperar-senha"><RecoveryPage /></Route><Route path="/localizar" component={LocatePage} /><Route path="/novo" component={NewItemPage} /><Route path="/item/:id" component={ItemDetailPage} /><Route path="/perfil" component={ProfilePage} /><Route><AppShell><EmptyState title="Página não encontrada" text="O endereço que você acessou não existe." action="Voltar ao início" href="/" /></AppShell></Route></Switch>; }

export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="top-center" richColors /><AppRouter /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
