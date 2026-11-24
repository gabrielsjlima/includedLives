package br.com.includedlives.api;
import jakarta.servlet.http.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.*;
import org.springframework.web.servlet.config.annotation.*;
import java.net.URI;
import java.util.*;
@Configuration
public class AccessConfig implements WebMvcConfigurer {
 private final org.springframework.jdbc.core.JdbcTemplate db;
 public AccessConfig(org.springframework.jdbc.core.JdbcTemplate db){this.db=db;}
 @Override public void addInterceptors(InterceptorRegistry registry){registry.addInterceptor(new HandlerInterceptor(){
  @Override public boolean preHandle(HttpServletRequest req,HttpServletResponse res,Object handler)throws Exception{
   String path=req.getRequestURI(),method=req.getMethod();if(!path.startsWith("/api/"))return true;
   boolean write=Set.of("POST","PUT","PATCH","DELETE").contains(method);
   if(write){String origin=req.getHeader("Origin");if(origin!=null){URI o=URI.create(origin);String host=req.getServerName();if(!host.equalsIgnoreCase(o.getHost())){res.sendError(403);return false;}}}
   boolean pub=(method.equals("POST") && Set.of("/api/recuperar-senha","/api/redefinir-senha").contains(path))||path.equals("/api/cadastro")||path.equals("/api/login")||(path.equals("/api/vagas")&&method.equals("GET"));
   if(pub)return true;
   HttpSession ss=req.getSession(false);if(ss==null||ss.getAttribute("id")==null){res.sendError(401);return false;}
   String t="empresa".equals(ss.getAttribute("tipo"))?"EMPRESA":"CANDIDATO";
   var hashes=db.queryForList("SELECT SENHA FROM "+t+" WHERE ID_"+t+"=?",String.class,ss.getAttribute("id"));
   if(hashes.isEmpty()||!Objects.equals(hashes.get(0),ss.getAttribute("passwordVersion"))){ss.invalidate();res.sendError(401);return false;}
   if(write&&!Objects.equals(ss.getAttribute("csrf"),req.getHeader("X-CSRF-Token"))){res.sendError(403,"CSRF inválido");return false;}
   return true;
  }
 }).addPathPatterns("/api/**");}
}
