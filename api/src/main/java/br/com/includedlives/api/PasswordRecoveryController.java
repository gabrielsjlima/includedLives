package br.com.includedlives.api;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api")
public class PasswordRecoveryController {
 private final JdbcTemplate db;
 private final JavaMailSender mail;
 private final SecureRandom random = new SecureRandom();
 private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
 private final Map<String,Long> limits = new HashMap<>();
 @Value("${spring.mail.username}") private String sender;
 @Value("${app.public-url}") private String base;
 public PasswordRecoveryController(JdbcTemplate db, JavaMailSender mail) { this.db=db; this.mail=mail; }
 private String hash(String token) {
  try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8))); }
  catch (java.security.NoSuchAlgorithmException e) { throw new IllegalStateException(e); }
 }
 private synchronized void limit(String key, long interval) {
  long now=System.currentTimeMillis();
  limits.entrySet().removeIf(e->e.getValue()<=now);
  if(limits.containsKey(key)||limits.size()>=10000) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS);
  limits.put(key,now+interval);
 }
 private String value(Map<String,Object> d,String key){return Objects.toString(d.get(key),"").trim();}
 private String table(String tipo){return switch(tipo){case "candidato"->"CANDIDATO";case "empresa"->"EMPRESA";default->throw new ResponseStatusException(HttpStatus.BAD_REQUEST);};}
 @PostMapping("/recuperar-senha")
 public Map<String,Object> request(@RequestBody Map<String,Object> d,HttpServletRequest req){
  String tipo=value(d,"tipo"), email=value(d,"email").toLowerCase(Locale.ROOT), t=table(tipo), pk="ID_"+t;
  if(email.length()>150||!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
  if(sender.isBlank()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
  limit("ip:"+req.getRemoteAddr(),3000); limit("email:"+tipo+":"+email,60000);
  var rows=db.queryForList("SELECT "+pk+" AS id,SENHA AS senha FROM "+t+" WHERE EMAIL=?",email);
  if(!rows.isEmpty()){
   var row=rows.get(0); long id=((Number)row.get("id")).longValue();
   byte[] bytes=new byte[32];random.nextBytes(bytes);String token=Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
   String digest=hash(token);
   db.update("INSERT INTO RECUPERACAO_SENHA(TIPO,ID_USUARIO,TOKEN_HASH,EMAIL,SENHA_ANTERIOR,EXPIRA_EM) VALUES(?,?,?,?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE)) ON DUPLICATE KEY UPDATE TOKEN_HASH=VALUES(TOKEN_HASH),EMAIL=VALUES(EMAIL),SENHA_ANTERIOR=VALUES(SENHA_ANTERIOR),EXPIRA_EM=VALUES(EXPIRA_EM)",tipo,id,digest,email,row.get("senha"));
   try {
    SimpleMailMessage msg=new SimpleMailMessage();msg.setFrom(sender);msg.setTo(email);msg.setSubject("Included Lives - Redefinição de senha");
    msg.setText("Recebemos uma solicitação de recuperação de senha da sua conta de "+tipo+".\n\nAcesse: "+base.replaceAll("/+$","")+"/login/redefinir-senha.html#token="+token+"\n\nO link vale por 30 minutos e só pode ser utilizado uma vez. Se não solicitou, ignore esta mensagem.");mail.send(msg);
   } catch(org.springframework.mail.MailException e){db.update("DELETE FROM RECUPERACAO_SENHA WHERE TOKEN_HASH=?",digest);org.slf4j.LoggerFactory.getLogger(getClass()).warn("Falha no envio de recuperação: {}",e.getClass().getSimpleName());}
  }
  return Map.of("ok",true);
 }
 @Transactional
 @PostMapping("/redefinir-senha")
 public Map<String,Object> reset(@RequestBody Map<String,Object> d,HttpServletRequest req){
  limit("reset:"+req.getRemoteAddr(),1000);
  String token=value(d,"token"), senha=value(d,"senha");
  if(!token.matches("[A-Za-z0-9_-]{43}")||senha.length()<8||senha.getBytes(StandardCharsets.UTF_8).length>72)throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
  String digest=hash(token);
  var rows=db.queryForList("SELECT TIPO,ID_USUARIO,EMAIL,SENHA_ANTERIOR FROM RECUPERACAO_SENHA WHERE TOKEN_HASH=? AND EXPIRA_EM>UTC_TIMESTAMP() FOR UPDATE",digest);
  if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
  var row=rows.get(0);String t=table((String)row.get("TIPO"));
  int changed=db.update("UPDATE "+t+" SET SENHA=? WHERE ID_"+t+"=? AND EMAIL=? AND SENHA=?",encoder.encode(senha),row.get("ID_USUARIO"),row.get("EMAIL"),row.get("SENHA_ANTERIOR"));
  if(changed!=1)throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
  db.update("DELETE FROM RECUPERACAO_SENHA WHERE TOKEN_HASH=?",digest);
  return Map.of("ok",true);
 }
}
