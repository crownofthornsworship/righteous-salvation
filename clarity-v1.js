(()=>{
  const SAVE='righteous-salvation-clarity-v1';
  let guided=true,record={wins:0,losses:0},recorded=false;
  try{const saved=JSON.parse(localStorage.getItem(SAVE)||'{}');guided=saved.guided!==false;record=saved.record||record}catch{}
  const persist=()=>{try{localStorage.setItem(SAVE,JSON.stringify({guided,record}))}catch{}};
  const startActions=document.querySelector('.start-actions');
  const toggle=document.createElement('label');
  toggle.className='guided-toggle';
  toggle.innerHTML=`<input id="guidedMatch" type="checkbox" ${guided?'checked':''}><span><b>Guided first match</b><br><small>Show the best next step</small></span>`;
  startActions.insertBefore(toggle,startActions.lastElementChild);
  toggle.querySelector('input').addEventListener('change',e=>{guided=e.target.checked;persist();updateCoach()});
  const coach=document.createElement('div');
  coach.className='clarity-bar';coach.setAttribute('role','status');coach.setAttribute('aria-live','polite');
  document.querySelector('.board').prepend(coach);
  const result=document.createElement('div');result.className='match-record';document.querySelector('.side .panel:last-child').append(result);
  const phases=['prepare','ministry','reflection'];
  function totalFaith(){return s?Object.values(s.faith).reduce((a,b)=>a+b,0):0}
  function playable(c){if(!s||s.over)return false;const d=defs[c.id],p=s.me,cost=d.cost+(d.kind==='Commander'?p.tax:0);if(d.kind==='Blessing')return s.phase==='prepare'&&!p.blessingPlayed;if(d.kind!=='Prayer'&&s.phase!=='prepare')return false;return canPay(p,d,cost,s.faith)}
  function decorateHand(){if(!s)return;document.querySelectorAll('#hand .card').forEach(el=>{const match=(el.getAttribute('onclick')||'').match(/inspect\((\d+)/);if(!match)return;const c=locate(Number(match[1]),'me'),d=c&&defs[c.id];if(!d)return;const cost=d.cost+(d.kind==='Commander'?s.me.tax:0),ok=playable(c);el.classList.toggle('playable',ok);el.classList.toggle('unplayable',!ok);el.setAttribute('aria-label',`${d.name}. ${d.kind}. Cost ${cost} Faith. ${ok?'Playable now.':'Not playable now.'}`);let badge=el.querySelector('.faith-preview');if(!badge){badge=document.createElement('span');badge.className='faith-preview';el.append(badge)}badge.textContent=d.kind==='Blessing'?'1 / TURN':`${cost} FAITH`})}
  function nextStep(){if(!s)return['Choose a commander','Select one of six unique ministries, choose an opponent, and begin.',1];if(s.over)return['Match complete',s.ai.sal>=20?'You completed the Great Commission. Try another commander or a new matchup.':'Review the Journey Log, then try a new strategy.',4];if(s.phase==='prepare'&&!s.me.blessingPlayed)return['Play a Blessing','Tap a glowing Blessing in your hand. You may play one each turn.',1];if(s.phase==='prepare'&&s.me.bless.some(c=>!c.tapped)&&totalFaith()===0)return['Gather Faith','Tap a Blessing on your battlefield, then choose its Faith color when asked.',2];if(s.phase==='prepare'&&[...s.me.hand,...(s.me.commander?[s.me.commander]:[])].some(playable))return['Build your ministry','Glowing cards are affordable now. Tap one to inspect it, then confirm the play.',2];if(s.phase==='prepare')return['Enter Ministry','You have made your preparation decisions. Move to Ministry when ready.',3];const ready=s.me.board.filter(c=>!c.tapped&&(!c.fresh||defs[c.id].godspeed));if(s.phase==='ministry'&&ready.length)return['Share Salvation',`You have ${ready.length} ready Servant${ready.length===1?'':'s'}. Tap a glowing Servant and send them into Ministry.`,3];return['End the turn','No more ready ministry actions remain. End your turn to see the opponent respond.',4]}
  function updateCoach(){if(!coach)return;if(!guided){coach.hidden=true;return}coach.hidden=false;const [title,text,step]=nextStep();let active=s?.phase||'prepare';coach.innerHTML=`<div class="clarity-step">${step}</div><div class="clarity-copy"><strong>${title}</strong><span>${text}</span></div><div class="phase-track">${phases.map(p=>`<span class="${active===p?'on':''}">${p}</span>`).join('')}</div>`}
  function updateRecord(){result.innerHTML=`<b>Local match record</b><br>${record.wins} wins · ${record.losses} losses <span class="mini">(saved on this device)</span>`}
  const originalRender=render;
  render=function(){originalRender();decorateHand();updateCoach();if(s?.over&&!recorded){recorded=true;if(s.ai.sal>=20)record.wins++;else record.losses++;persist();updateRecord()}};
  const originalBegin=begin;
  begin=function(){recorded=false;originalBegin();updateCoach()};
  const originalShowRules=showRules;
  showRules=function(){originalShowRules();const title=document.querySelector('#modalContent h2');if(title)title.insertAdjacentHTML('afterend','<div class="quick-help"><div><b>1 · Provision</b>Refresh and draw.</div><div><b>2 · Preparation</b>Play a Blessing and cast cards.</div><div><b>3 · Ministry</b>Send ready Servants.</div><div><b>4 · Reflection</b>End the turn.</div></div>')};
  updateRecord();updateCoach();
})();
