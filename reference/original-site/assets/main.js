// Dhruvir site JS
(function(){
  // header scroll state
  var header=document.querySelector('header');
  function onScroll(){ if(window.scrollY>24){header.classList.add('scrolled')}else{header.classList.remove('scrolled')} }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile menu
  var btn=document.querySelector('.menu-btn'), links=document.querySelector('.nav-links');
  if(btn&&links){ btn.addEventListener('click',function(){ btn.classList.toggle('open'); links.classList.toggle('open'); }); }

  // reveal on scroll (with failsafes so content can never stay hidden)
  var els=document.querySelectorAll('.reveal');
  function revealAll(){ els.forEach(function(el){el.classList.add('in')}); }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:.05,rootMargin:'0px 0px -5% 0px'});
    els.forEach(function(el){io.observe(el)});
    setTimeout(function(){
      var vh=window.innerHeight;
      els.forEach(function(el){ if(el.getBoundingClientRect().top < vh*0.95) el.classList.add('in'); });
    },1200);
    setTimeout(revealAll,6000);
  } else { revealAll(); }

  // enquiry form (FormSubmit AJAX, falls back to normal POST without JS)
  var form=document.querySelector('form.enq');
  if(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var status=form.querySelector('.form-status');
      var btn=form.querySelector('button[type=submit]');
      btn.disabled=true; btn.textContent='Sending...';
      var data=new FormData(form);
      fetch(atob('aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2FqYXgvYWtzaGF0QGRocnV2aXIuY29t'),{method:'POST',body:data,headers:{'Accept':'application/json'}})
      .then(function(r){return r.json().then(function(j){return {ok:r.ok,body:j}})})
      .then(function(res){
        if(res.ok){
          status.className='form-status ok';
          status.textContent='Enquiry received. Our engineering team will respond within one business day.';
          form.reset();
        } else { throw new Error((res.body&&res.body.message)||'send failed'); }
      })
      .catch(function(){
        status.className='form-status err';
        status.textContent='The form could not be sent. Please try again in a few minutes.';
      })
      .finally(function(){ btn.disabled=false; btn.textContent='Send enquiry'; });
    });
  }
})();
