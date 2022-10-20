import { Request, Response, NextFunction } from "express";
import { ViteDevServer } from "vite";
import { isProduction } from "./utils/env";
import { readFileSync } from "fs";
import { resolveClientPath, resolveDistPath } from "./utils/resolve-path";

export const renderer = async (
  vite: ViteDevServer,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = req.originalUrl;
  let render: (url: string) => Promise<{ html: string }>;
  let template: string;
  const TEMPLATE_PLACEHOLDER = "<!-- template-placeholder -->";
  try {
    if (isProduction) {
      template = readFileSync(resolveDistPath("client", "index.html"), {
        encoding: "utf-8",
      });
      render = (await import(resolveDistPath("client", "entry-server-react.js")))
        .render;
    } else {
      template = readFileSync(resolveClientPath("index.html"), {
        encoding: "utf-8",
      });
      template = await vite.transformIndexHtml(url, template);
      const reactRenderer = resolveClientPath("entry-server-react.tsx");
      const plugin = await vite.ssrLoadModule(reactRenderer); 
      render = plugin.render;
    }

    const { html } = await render(url);
    res.send(template.replace(TEMPLATE_PLACEHOLDER, html));
  } catch (error) {
    console.warn(error);
    vite && vite.ssrFixStacktrace(error);
  }
};
