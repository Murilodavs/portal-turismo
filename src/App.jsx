import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Globe, Search, Menu, Calendar, ArrowRight, Database } from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO OFICIAL DO SUPABASE
// ============================================================================
const supabaseUrl = 'https://wxnpahxlicpnazvjykii.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_DRRv9rqn-oulVmroj8FT5Q_quwSjm18';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroDB, setErroDB] = useState(false);
  const [detalheErro, setDetalheErro] = useState("");

  useEffect(() => {
    async function fetchNoticias() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news') 
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setNoticias(data);
          setErroDB(false);
        } else {
          setErroDB(true);
          setDetalheErro("Aviso: A tabela 'news' está vazia na base de dados.");
        }
      } catch (error) {
        console.error('Erro ao ligar ao Supabase:', error);
        setErroDB(true);
        setDetalheErro(`Erro da API: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchNoticias();
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return '';
    try {
      const opcoes = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dataString).toLocaleDateString('pt-PT', opcoes);
    } catch (e) {
      return dataString;
    }
  };

  const noticiaDestaque = noticias[0];
  const outrasNoticias = noticias.slice(1);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* HEADER MINIMALISTA */}
      <header className="border-b border-neutral-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 bg-neutral-900 rounded-sm flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-neutral-900 uppercase">
                Portal<span className="font-light">Turismo</span>
              </span>
            </div>

            {/* Links Desktop */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-sm tracking-widest uppercase font-semibold text-neutral-400 hover:text-neutral-900 transition-colors">Últimas</a>
              <a href="#" className="text-sm tracking-widest uppercase font-semibold text-neutral-400 hover:text-neutral-900 transition-colors">Destinos</a>
            </nav>

            {/* Ícones Direita */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors hidden sm:block">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors md:hidden">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* AVISO DE ERRO */}
      {erroDB && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-sm">
            <h3 className="text-neutral-900 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Database className="h-4 w-4" />
              Aviso de Sistema
            </h3>
            <p className="text-neutral-500 font-mono text-xs mb-2">
              {detalheErro}
            </p>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-[60vh] bg-neutral-100 w-full"></div>
          </div>
        ) : (
          <>
            {/* NOTÍCIA EM DESTAQUE */}
            {noticiaDestaque && (
              <section className="mb-24">
                <a href={noticiaDestaque.external_link || '#'} target={noticiaDestaque.external_link ? "_blank" : "_self"} className="group block">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    
                    <div className="lg:col-span-8 overflow-hidden aspect-[16/9] md:aspect-[21/9] lg:aspect-[4/3] bg-neutral-100">
                      <img 
                        src={noticiaDestaque.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                        alt={noticiaDestaque.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                    </div>
                    
                    <div className="lg:col-span-4 flex flex-col justify-center py-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 block">
                        {noticiaDestaque.category || 'Destaque'}
                      </span>
                      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight tracking-tight group-hover:underline decoration-2 underline-offset-4">
                        {noticiaDestaque.title || "Sem título"}
                      </h1>
                      <p className="text-neutral-500 text-lg mb-8 line-clamp-4 leading-relaxed">
                        {noticiaDestaque.content || ""}
                      </p>
                      <div className="flex items-center text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                        {formatarData(noticiaDestaque.created_at || noticiaDestaque.date)}
                        {noticiaDestaque.source && (
                          <>
                            <span className="mx-2">•</span>
                            {noticiaDestaque.source}
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </a>
              </section>
            )}

            {/* OUTRAS NOTÍCIAS */}
            {outrasNoticias.length > 0 && (
              <div>
                <div className="mb-12 border-b border-neutral-200 pb-4">
                  <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
                    Últimas Edições
                  </h2>
                </div>
                
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {outrasNoticias.map((noticia, index) => (
                    <a href={noticia.external_link || '#'} target={noticia.external_link ? "_blank" : "_self"} key={noticia.id || index} className="group block flex flex-col">
                      
                      <div className="aspect-[4/3] overflow-hidden mb-5 bg-neutral-100">
                        <img 
                          src={noticia.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                          alt={noticia.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                        />
                      </div>
                      
                      <div className="flex flex-col flex-grow">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3 block">
                          {noticia.category || 'Geral'}
                        </span>
                        <h3 className="text-xl font-bold text-neutral-900 mb-3 leading-snug group-hover:underline decoration-1 underline-offset-4 line-clamp-2">
                          {noticia.title || "Sem título"}
                        </h3>
                        <p className="text-neutral-500 mb-5 line-clamp-3 text-sm leading-relaxed flex-grow">
                          {noticia.content || ""}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            {formatarData(noticia.created_at || noticia.date)}
                          </span>
                          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Ler <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>

                    </a>
                  ))}
                </section>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-200 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <span className="text-2xl font-bold tracking-tighter text-neutral-900 uppercase mb-6">
            Portal<span className="font-light">Turismo</span>
          </span>
          <p className="text-neutral-400 text-sm mb-8 text-center max-w-md leading-relaxed">
            A tua fonte direta para inspiração de viagens. Destinos escondidos, guias locais e turismo sustentável.
          </p>
          <div className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}