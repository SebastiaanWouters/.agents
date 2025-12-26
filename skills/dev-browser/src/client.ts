/**
 * Dev Browser Client
 * 
 * Simple HTTP client for the dev-browser server.
 */

export interface PageInfo {
  name: string;
  url: string;
}

export interface DevBrowser {
  /** List all pages */
  list(): Promise<PageInfo[]>;
  
  /** Get or create a page by name */
  page(name: string): Promise<DevBrowserPage>;
  
  /** Close a page */
  close(name: string): Promise<void>;
  
  /** Shutdown the server (closes all pages and browser) */
  shutdown(): Promise<void>;
}

export interface DevBrowserPage {
  name: string;
  
  /** Navigate to URL */
  goto(url: string, options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2" }): Promise<{ url: string; title: string }>;
  
  /** Run JavaScript in page context */
  evaluate<T = unknown>(script: string): Promise<T>;
  
  /** Take a screenshot */
  screenshot(options?: { path?: string; fullPage?: boolean }): Promise<{ path: string }>;
  
  /** Click an element */
  click(selector: string): Promise<void>;
  
  /** Type text into an element */
  type(selector: string, text: string): Promise<void>;
  
  /** Get page HTML content */
  content(): Promise<string>;
  
  /** Get accessibility snapshot */
  snapshot(): Promise<unknown>;
  
  /** Get current URL */
  url(): Promise<string>;
}

export async function connect(serverUrl = "http://localhost:9222"): Promise<DevBrowser> {
  // Verify server is running
  const res = await fetch(serverUrl);
  if (!res.ok) {
    throw new Error(`Server not responding: ${res.status}`);
  }
  
  async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const res = await fetch(`${serverUrl}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await res.json() as T & { error?: string };
    
    if (!res.ok) {
      throw new Error(data.error || `Request failed: ${res.status}`);
    }
    
    return data;
  }
  
  return {
    async list(): Promise<PageInfo[]> {
      const data = await request<{ pages: PageInfo[] }>("/pages");
      return data.pages;
    },
    
    async page(name: string): Promise<DevBrowserPage> {
      await request("/pages", "POST", { name });
      
      return {
        name,
        
        async goto(url, options) {
          return request(`/pages/${encodeURIComponent(name)}/goto`, "POST", { 
            url, 
            waitUntil: options?.waitUntil,
          });
        },
        
        async evaluate<T>(script: string): Promise<T> {
          const data = await request<{ result: T }>(`/pages/${encodeURIComponent(name)}/evaluate`, "POST", { script });
          return data.result;
        },
        
        async screenshot(options) {
          return request(`/pages/${encodeURIComponent(name)}/screenshot`, "POST", options || {});
        },
        
        async click(selector) {
          await request(`/pages/${encodeURIComponent(name)}/click`, "POST", { selector });
        },
        
        async type(selector, text) {
          await request(`/pages/${encodeURIComponent(name)}/type`, "POST", { selector, text });
        },
        
        async content(): Promise<string> {
          const data = await request<{ content: string }>(`/pages/${encodeURIComponent(name)}/content`);
          return data.content;
        },
        
        async snapshot(): Promise<unknown> {
          const data = await request<{ snapshot: unknown }>(`/pages/${encodeURIComponent(name)}/snapshot`);
          return data.snapshot;
        },
        
        async url(): Promise<string> {
          const pages = await request<{ pages: PageInfo[] }>("/pages");
          const page = pages.pages.find(p => p.name === name);
          return page?.url || "about:blank";
        },
      };
    },
    
    async close(name: string): Promise<void> {
      await request(`/pages/${encodeURIComponent(name)}`, "DELETE");
    },
    
    async shutdown(): Promise<void> {
      await request("/shutdown", "POST");
    },
  };
}
