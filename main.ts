import{readFileSync,readdirSync,mkdirSync,writeFileSync}from"node:fs";
import{join}from"node:path";
const I=process.env.MAKEFUN_INPUT_DIR||"/input",O=process.env.MAKEFUN_OUTPUT_DIR||"/output";
const K={0:[0,0,0],1:[1,0,1],2:[4,0,1],3:[0,1,0],4:[0,1,2],5:[0,2,2],6:[0,2,3],7:[0,3,3],23:[0,1,1],27:[0,1,1],48:[2,0,0],49:[2,1,0],50:[2,1,0],51:[2,0,0],52:[0,0,0],64:[0,1,1],65:[0,2,0],80:[0,1,0],81:[0,1,0],82:[0,0,1],83:[0,1,0]};
const F=[(a,b)=>a+b|0,(a,b)=>a-b|0,Math.imul,(a,b)=>a===-2147483648&&b===-1?a:(a/b)|0,(a,b)=>b===-1?0:a%b|0,(a,b)=>Math.floor((a>>>0)/(b>>>0))|0,(a,b)=>(a>>>0)%(b>>>0)|0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>a>>>(b&31)|0,(a,b)=>a===b?1:0,(a,b)=>a<b?1:0,(a,b)=>(a>>>0)<(b>>>0)?1:0];
function run(p,g){
 const D=new Int32Array(256);let s=0;
 const C=new Int32Array(64);let c=0;
 const M=new Int32Array(256);
 const o=new Uint8Array(65536);let l=0;
 let q=0,pc=0,t=0;
 const done=e=>({o:o.slice(0,l),e});
 for(;;){
  if(t===1e6)return done(10);
  if(pc<0||pc>=p.length)return done(9);
  const b=p[pc];
  if(!(b<8||b>15&&b<35||b>47&&b<53||b>63&&b<66||b>79&&b<84))return done(5);
  const[m,a,u]=K[b]??[0,2,1];
  if(pc+m>=p.length)return done(9);
  t++;const x=pc+1+m;
  if(s<a)return done(2);
  if(s-a+u>256)return done(3);
  pc=x;
  switch(b){
   case 0:return done(0);
   case 1:D[s++]=p[x-1]<<24>>24;break;
   case 2:D[s++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const v=D[s-1];D[s-1]=D[s-2];D[s-2]=v;break;}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const v=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=v;break;}
   case 23:D[s-1]=-D[s-1]|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 48:pc=x+((p[x-2]|p[x-1]<<8)<<16>>16);break;
   case 49:case 50:{const v=D[--s];if((b===49)===(v===0))pc=x+((p[x-2]|p[x-1]<<8)<<16>>16);break;}
   case 51:if(c===64)return done(7);C[c++]=x;pc=p[x-2]|p[x-1]<<8;break;
   case 52:if(!c)return done(8);pc=C[--c];break;
   case 64:{const a=D[s-1];if(a<0||a>255)return done(6);D[s-1]=M[a];break;}
   case 65:{const a=D[s-1],v=D[s-2];if(a<0||a>255)return done(6);s-=2;M[a]=v;break;}
   case 80:{const u=String(D[s-1]);if(l+u.length>65536)return done(11);for(const c of u)o[l++]=c.charCodeAt(0);s--;break;}
   case 81:if(l>=65536)return done(11);o[l++]=D[--s]&255;break;
   case 82:D[s++]=q<g.length?g[q++]:-1;break;
   case 83:return done(D[--s]&255);
   default:{const y=D[s-1],a=D[s-2];if(b>18&&b<23&&!y)return done(4);s-=2;D[s++]=F[b-16-(b>23)-(b>27)-(b>31)](a,y);}
  }
 }
}
for(const d of readdirSync(I).sort()){
 const r=run(readFileSync(join(I,d,"program.bin")),readFileSync(join(I,d,"input.bin")));
 mkdirSync(join(O,d),{recursive:true});
 writeFileSync(join(O,d,"stdout.bin"),r.o);
 writeFileSync(join(O,d,"exit.txt"),r.e+"\n");
}
