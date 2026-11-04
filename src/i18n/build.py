import json,re,sys,importlib.util,glob,os
D=os.path.dirname(os.path.abspath(__file__))
SR={};SRT={}
for f in sorted(glob.glob(D+'/sr*.py')):
    spec=importlib.util.spec_from_file_location(os.path.basename(f)[:-3],f); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    SR.update(getattr(m,'SR',{})); SRT.update(getattr(m,'SRT',{}))
for k in ['Sprig']: SR.pop(k,None)
SR={re.sub(r'\s+',' ',k).strip():v for k,v in SR.items() if v and v!=k}
rt=open(D+'/runtime.js').read().replace('__DICT__',json.dumps(SR,ensure_ascii=False)).replace('__TPL__',json.dumps([[k,v] for k,v in SRT.items()],ensure_ascii=False))
f=sys.argv[1]; s=open(f).read()
block='<script id="pp-i18n">\n'+rt+'</script>\n'
if '<script id="pp-i18n">' in s:
    s=re.sub(r'<script id="pp-i18n">.*?</script>\n',lambda m:block,s,count=1,flags=re.S)
else:
    i=s.index('<script>'); s=s[:i]+block+s[i:]
open(f,'w').write(s)
print('dict',len(SR),'tpl',len(SRT))
