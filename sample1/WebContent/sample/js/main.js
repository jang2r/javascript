(() => {
	
	let yOffset = 0; //window.pageYOffset
	let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된 신
	let enterNewScene = false; // 새로운 secen이 시작되는 순간 ture
	
	const sceneInfo = [
		{
			// 0
			type:'sticky',
			heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
			scrollHeight : 0,
			objs:{
				container : document.querySelector('#scroll-section-0'),
				messageA : document.querySelector('#scroll-section-0 .main-message.a'),
				messageB : document.querySelector('#scroll-section-0 .main-message.b'),
				messageC : document.querySelector('#scroll-section-0 .main-message.c'),
				messageD : document.querySelector('#scroll-section-0 .main-message.d')
			},
			values:{
				messageA_opacity_in : [0,1,{start:0.1,end:0.2}],
				messageA_opacity_out : [1,0,{start:0.25,end:0.3}],
				messageA_translateY_in : [20,0,{start:0.1,end:0.2}],
				messageA_translateY_out : [0,-20,{start:0.1,end:0.2}],
				
				messageB_opacity_in : [0,1,{start:0.3,end:0.4}],
			}
		},
		{
			// 1
			type:'normal',
			heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
			scrollHeight : 0,
			objs:{
				container : document.querySelector('#scroll-section-1')
			}			
		},
		{
			// 2		
			type:'sticky',
			heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
			scrollHeight : 0,
			objs:{
				container : document.querySelector('#scroll-section-2')
			}			
		},
		{
			// 3			
			type:'sticky',
			heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
			scrollHeight : 0,
			objs:{
				container : document.querySelector('#scroll-section-3')
			}			
		}
		
	];
	
	function setLayout(){
		// 각 스쿠롤 섹션의 높이 세팅
		for(let i=0; i<sceneInfo.length; i++){
			sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			sceneInfo[i].objs.container.style.height = sceneInfo[i].scrollHeight+"px"; 
		}
		yOffset = window.pageYOffset;
		let totalScrollHeight = 0;
		for(let i=0; i<sceneInfo.length; i++ ){
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if(totalScrollHeight >= yOffset){
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id',`show-scene-${currentScene}`); 
		
	} 
	
	function calcValues(values, currentYOffset){
		let rv;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
		
		if(values.length ===3 ){
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd =  values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart; 
			if(currentYOffset >= partScrollStart && partScrollEnd >=currentYOffset){
				rv = (currentYOffset-partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			}else if(currentYOffset < partScrollStart){
				rv = values[0];
			}else if(currentYOffset > partScrollEnd){
				rv = values[1];
			}
			
		}else{
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}
		
		return rv;
	}
	
	function playAnimation(){
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset-prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight ;
		switch(currentScene){
			case 0:
				//console.log('0');
				let messageA_opacity_in = calcValues(values.messageA_opacity_in,currentYOffset);
				let messageA_opacity_out = calcValues(values.messageA_opacity_out,currentYOffset);
				let messageA_translateY_in = calcValues(values.messageA_translateY_in,currentYOffset);
				let messageA_translateY_out = calcValues(values.messageA_translateY_out,currentYOffset);	
				if(scrollRatio <= 0.22){
					objs.messageA.style.opacity = messageA_opacity_in;
					objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
				}else{
					objs.messageA.style.opacity = messageA_opacity_out;
					objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
				}
				break;
			case 1:
				//console.log('1');
				break;	
			case 2:
				//console.log('2');
				break;
			case 3:
				//console.log('3');
				break;
		}
	}
	
	function scrollLoop(){
		enterNewScene = false;
		prevScrollHeight = 0;
		for(let i=0; i<currentScene; i++){
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}
		if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
			enterNewScene = true;
			currentScene ++;
			document.body.setAttribute('id',`show-scene-${currentScene}`);
		}
		if(yOffset < prevScrollHeight){
			enterNewScene = true;
			if(currentScene === 0) return;
			currentScene --;
			document.body.setAttribute('id',`show-scene-${currentScene}`);
		}
		if(enterNewScene) return ;
		playAnimation();
	}
	
	
	window.addEventListener('scroll',() => {
		yOffset = window.pageYOffset;
		scrollLoop();
	});
	window.addEventListener('load',setLayout);
	window.addEventListener('resize',setLayout);
})();