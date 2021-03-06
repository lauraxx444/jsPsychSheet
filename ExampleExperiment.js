function ExampleExperiment(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

    function RunExperiment(session) {
        // generate a random subject ID with 15 characters
	var subject_id = jsPsych.randomization.randomID(6);
	
	// record the condition assignment in the jsPsych data
	// this adds a property called 'subject' and a property called 'condition' to every trial
	jsPsych.data.addProperties({
  		subject: subject_id,
	});
	    
	/* create timeline */
	var timeline = [];

	/* define welcome message trial */	
	var welcome = {
  		type: "html-keyboard-response",
  		stimulus: "Welcome to the experiment. Press any key to begin."
	};
	timeline.push(welcome);
    
    var check_consent = function(elem) {
  if (document.getElementById('consent_checkbox').checked) {
    return true;
  }
  else {
    alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
    return false;
  }
  return false;
};

  /* require consent */
	var consent = {
    	 type:'external-html',
     	 url: "https://ufpaclab.github.io/Consent-Forms/Active/Consent.html",
    	  cont_btn: "consent-button"
    	  //check_fn: check_consent
           };
    timeline.push(consent);
	
 
    var trial = {
      type: 'html-button-response',
      stimulus: '<p>Sex</p>',
      choices: ['Male', 'Female', 'Intersex'],
      prompt: "<p>What is your gender?</p>"
    };
    timeline.push(trial);
    
    var survey_trial = {
  type: 'survey-text',
  questions: [
    {prompt: "How old are you?", name: 'Age'}
  ],
};
timeline.push(survey_trial)

  /* define experiment instructions */ 
     var instructions = {
       type: "html-keyboard-response",
       stimulus: "<p>Thank you for choosing to participate in this experiment. " + 
       "Please read the instructions before begining.</p>",
     };
     timeline.push(instructions);
	    
	  var sound_instructionswait = {
            type: "html-keyboard-response",
            stimulus: "<p>For the duration of the experiment, please use headphones or turn your speakers to a comfortable volume. " + 
            "Please use the following screen as an opportunity to check your audio settings and adjust as necessary.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
         };
         
       var sound_instructionsgo = {
            type: "html-keyboard-response",
            stimulus: "<p>For the duration of the experiment, please use headphones or turn your speakers to a comfortable volume. "+ 
            "Please use the following screen as an opportunity to check your audio settings and adjust as necessary.</p>" +
            "<p>Press any key to continue.</p>",
         };
           timeline.push(sound_instructionswait, sound_instructionsgo);
	    
	   var pre_if_trial = {
      type: 'video-keyboard-response',
      sources: ['resources/AuditoryBaVisualBa.mp4'],
      width: 800,
  		prompt: '<p>Use this screen to test your sound settings and volume. Press any key to repeat the video. When you are ready to continue, press C.</p>'
  	}

    var loop_node = {
      timeline: [pre_if_trial],
      loop_function: function(data){
          if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('c') == data.values()[0].key_press){
              return false;
          } else {
            return true;
          }
      }
  	};
      timeline.push(pre_if_trial, loop_node);
	    
var arms = {
	type: 'image-button-response',
    stimulus: "resources/armsLength.png",
    choices: jsPsych.NO_KEYS,
    prompt:  "<p>Throughout the entirity of the experiment, please sit at an arm's distance from your computer screen, as illustrated above. "+ 
            "Your attention should also be focused on the center of your screen.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
            };
       timeline.push(arms)
	    
var second = { 
	type: "html-keyboard-response",
	stimulus: "<p>This experiment consists of three parts, each part having multiple trials.</p> " +
       "<p>During the first phase, you will watch a video of a woman as she pronounces a syllable."+
       "After viewing the video, you will identify which syllable she pronounced - four options will be provided. " +
       "You will then be asked to rate how confident you were in your selection on a scale of 0 to 100" +
       " (0 being <strong>not confident</strong> and 100 being <strong>fully confident</strong>).</p> ",
	 };
     timeline.push(second);
	    
var third = {
	type: "html-keyboard-response",
	stimulus:   "<p>During the second phase of the experiment, you will watch a series of videos.</p>"+
       "<p> In the third and final phase, you will again watch a video, select the response indicating which syllable was said,"+
       " and then rank the confidence of your answer. After which, the experiment will be completed.</p>",
	};
	timeline.push(third);
	    
var fourth = {
	type: "html-keyboard-response",
	stimulus:  "<p> *compensation instructions* </p>",
	};
	timeline.push(fourth);
	    
var fifth = {
	type: "html-keyboard-response",
	stimulus:  "<p>We will start with a practice run. Your responses will not be incorporated into the experiment.</p>"+
       "<p> Press any key to begin.</p>",
	};
	timeline.push(fifth);   
	
    var prepare = {
      type: "html-keyboard-response",
      stimulus: "Screen to prepare for experiment."
    };
    timeline.push(prepare);
    
    var practice_trial = {
		timeline: [
			{
				type: 'video-button-response',
				sources: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>'
				
			},
			{
				type: 'video-button-response',
				sources: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>"
			}
		],
		timeline_variables: [
			{ video: ['resources/AuditoryBaVisualBa.mp4'], syllables: ['Still need to decide what these choices should be'] },
			{ video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Da','Ga','Pa'],1) },
			{ video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
		],
		randomize_order: true,
    	repetitions: 0
	}
//	timeline.push(practice_trial);
    
    /* prep for experiment trials */ 
     var pretest = {
       type: "html-keyboard-response",
       stimulus: "<p>Now that you have completed the practice trials, we are ready to begin the first part of the experiment. " + 
       "Your responses will now be recorded. </p>" +
       "<p>Press any key to begin.</p>",
     };
     timeline.push(pretest);

    /* Present a randomized order of all of the videos/trials you wish to show */
    /* Make sure the answer choices are contingent on the video */
    /* The answer choices are mainly from Table 1 in Stropahl et al., 2017 */
    /* We'll have to decide which options to give for the ones that aren't from that table */
    /* To learn more, check out https://www.jspsych.org/overview/timeline/#timeline-variables */
    
	var pre_exposure = {
		timeline: [
			{
				type: 'video-button-response',
				sources: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>'
				
			},
			{
				type: 'video-button-response',
				sources: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>"
			}
		],
		timeline_variables: [
            { video: ['resources/AuditoryBaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
			{ video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ka','Ga','Da'],1) },
            { video: ['resources/AuditoryMaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ga','Na','Ba'],1) },
            { video: ['resources/AuditoryPaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Da','Ka','Ta'],1) },
            { video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Da','Ka','Ta'],1) },
            { video: ['resources/AuditoryPaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ga','Ka','Ta'],1) },
					
        ],
		randomize_order: true,
    	repetitions: 0
	}
	timeline.push(pre_exposure);
	    
	    /* prep for exposure trial */ 
         var exposure_prepwait = {
           type: "html-keyboard-response",
           stimulus: "<p>This concludes the first part of the experiment. In this next part, you will be watching a series of videos.</p>",
           choices: jsPsych.NO_KEYS,
            trial_duration: 5000,
         };
         var exposure_prepgo = {
           type: "html-keyboard-response",
           stimulus: "<p>This concludes the first part of the experiment. In this next part, you will be watching a series of videos.</p>" +
           "<p>Press any key to begin the second part.</p>",
         };
         timeline.push(exposure_prepwait,exposure_prepgo);
	    
	        /* define exposure condition */
var exposure = {
		timeline: [
			{
				type: 'video-button-response',
				sources: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>'
				
			},
			
		],
		timeline_variables: [
			{ video: ['resources/AuditoryBaVisualBa.mp4'], syllables: ['Still need to decide what these choices should be'] },
			{ video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Da','Ga','Pa'],1) },
			{ video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
			{ video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ka','Ga','Da'],1) },
			{ video: ['resources/AuditoryBaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Na','Ga','Da'],1) },
			{ video: ['resources/AuditoryBaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ta','Pa','Da'],1) },
			{ video: ['resources/AuditoryDaVisualMa.mp4'], syllables: ['Still need to decide what these choices should be'] },
			{ video: ['resources/AuditoryMaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ga','Na','Ba'],1) },
			{ video: ['resources/AuditoryMaVisualKa.mp4'], syllables: ['Still need to decide what these choices should be'] },
			{ video: ['resources/AuditoryMaVisualMa.mp4'], syllables: ['Still need to decide what these choices should be'] },
			{ video: ['resources/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Na','La'],1) },
			{ video: ['resources/AuditoryNaVisualDa.mp4'], syllables: ['Still need to decide what these choices should be'] },
			{ video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Da','Ka','Ta'],1) },
			{ video: ['resources/AuditoryPaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ga','Ka','Ta'],1) },
			{ video: ['resources/AuditoryPaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Da','Ka','Ta'],1) },
			{ video: ['resources/AuditoryPaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Na','Ka','Ta'],1) },
			{ video: ['resources/AuditoryPaVisualPa.mp4'], syllables: ['Still need to decide what these choices should be'] },
			{ video: ['resources/AuditoryPaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ta','Da','Ka'],1) },
			{ video: ['resources/AuditoryTaVisualGa.mp4'], syllables: ['Still need to decide what these choices should be'] },
			
		],
		randomize_order: true,
    	repetitions: 1
	}
	//timeline.push(exposure);
	    
	       /* prep for post-exposure trial */ 
         var postexposure_prepwait = {
           type: "html-keyboard-response",
           stimulus: "<p>This concludes the second part of the experiment. You will now begin the last part. " +
           "Remember, you will be watching videos of a syllable being pronounced. "+
           "You will then be selecting which response was said and ranking the confidence of your response. " +
           "0 represents <strong>not confident</strong>, while 100 represents <strong>fully confident</strong>.</p>",
           choices: jsPsych.NO_KEYS,
            trial_duration: 8000,
         };
         var postexposure_prepgo = {
           type: "html-keyboard-response",
           stimulus: "<p>This concludes the second part of the experiment. You will now begin the last part. " +
           "Remember, you will be watching videos of a syllable being pronounced. "+
           "You will then be selecting which response was said and ranking the confidence of your response. " +
           "0 represents <strong>not confident</strong>, while 100 represents <strong>fully confident</strong>.</p>"+
           "<p>Press any key to begin the third part.</p>",
         };
         timeline.push(postexposure_prepwait,postexposure_prepgo);
	    
   /* define post-exposure condition */     
var post_exposure = {
		timeline: [
			{
				type: 'video-button-response',
				sources: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>'
				
			},
			{
				type: 'video-button-response',
				sources: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
               require_movement:true
			}
		],
		timeline_variables: [
			{ video: ['resources/AuditoryBaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
			{ video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ka','Ga','Da'],1) },
            { video: ['resources/AuditoryMaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ga','Na','Ba'],1) },
            { video: ['resources/AuditoryPaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Da','Ka','Ta'],1) },
            { video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Da','Ka','Ta'],1) },
            { video: ['resources/AuditoryPaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ga','Ka','Ta'],1) },
		
        ],
		randomize_order: true,
	}
	//timeline.push(post_exposure);
	    
    var endgo = {
        type: "html-keyboard-response",
        stimulus: "<p>This now concludes the experiment. <strong> Please do not close the experiment until your responses have been confirmed as recorded.</strong> "+
        "Compensation cannot be gauranteed for incomplete participation.</p>"+
       "<p> Press any key to continue.</p>",
        };
      timeline.push(endgo);
	
        /* start the experiment */
        jsPsych.init({
            timeline: timeline,
            show_progress_bar: true,
            on_trial_finish: session.insert,
            on_finish: function() { window.top.location.href = SONA_URL }
        });
    }
}