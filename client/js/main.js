$(function(){
	var propID = 0;
	$('#prop_bt').click(function() {
		let yourID = propID++;
		$('#prop_list').append(`
			<li id="prop${yourID}"><div>
				<input list="props"><input type="button" value="DELETE" id="prop${yourID}_bt" class="inline">
			</div></li>
		`);
		$(`#prop${yourID}_bt`).click(function() {
			$(`#prop${yourID}`).remove();
		});
	});

	var trigID = 0;
	$('#trig_bt').click(function() {
		let yourID = trigID++;
		$('#trig_list').append(`
			<li id="trig${yourID}">
				${triggerDOMstring(yourID)}
				<div class="delete_wrapper">
					<input type="button" value="DELETE" id="trig${yourID}_bt" class="little">
				</div>
			</li>
		`);
		$(`#trig${yourID}_bt`).click(function() {
			$(`#trig${yourID}`).remove();
		});
	});

	function triggerDOMstring(yourID) {
		return `<div class="text inline"><b>Trigger type</b></div>
			<input list="trigs" id="trig${yourID}_txt" class="inline">
			<div class="text inline"><b>Target type</b></div>
			<input list="types" id="trig${yourID}_typ" class="inline">
			<div class="text inline">
				<b>Target</b><br>
				<i>If not default, leave blank</i>
			</div>
			<input list="targs" id="trig${yourID}_tar" class="inline">`;
	}

	var actID = 0, actIDs = [];
	$('#act_bt').click(function() {
		let yourID = actID++;
		actIDs.push(yourID);
		$('#act_list').append(`
			<li id="act${yourID}">
				<div id="inn${yourID}">
					${actionDOMstring(yourID)}
				</div>
				<div class="delete_wrapper">
					<input type="button" value="DELETE" id="act${yourID}_bt" class="little">
				</div>
			</li>
		`);
		$(`#act${yourID}_bt`).click(function() {
			$(`#act${yourID}`).remove();
			actIDs.splice(actIDs.indexOf(yourID), 1);
		});
		$(`#act${yourID}_ext`).click(expandClick(yourID, yourID));
	});

	function actionDOMstring(yourID) {
		return `<div class="text inline"><b>Action type</b></div>
			<input list="acts" id="act${yourID}_txt" class="inline line">
			<div class="text inline">
				<b>Target</b><br>
				<i>If not default, leave blank</i>
			</div>
			<input list="targs" id="act${yourID}_tar" class="inline line">
			<div id="cut${yourID}">
				<div class="text inline">
					<b>Parameter</b><br>
					<i>If not needed, leave blank</i>
				</div>
				<div class="line">
					<input list="pars" id="act${yourID}_par" class="inline">
					<input type="button" value="..." id="act${yourID}_ext" class="inline">
				</div>
			</div>`;
	}

	function expandClick(origID, id) {
		return function() {
			let newID = id + '_1';
			switch($(`#act${id}_txt`).val()) {
				case 'Add property':
					$(`#inn${origID}`).append(`<div class="text inline"><b>Property</b></div><input list="props" id="prop${newID}_txt" class="inline">`);
					$(`#cut${id}`).remove();
					break;
				case 'Add trigger':
					$(`#inn${origID}`).append(triggerDOMstring(newID));
					$(`#cut${id}`).remove();
					break;
				case 'Add action':
					$(`#inn${origID}`).append(actionDOMstring(newID));
					$(`#act${newID}_ext`).click(expandClick(origID, newID));
					$(`#cut${id}`).remove();
					break;
			}
		}
	}

	var list = [];

	$('#lst_bt').click(function() {
		list.push({
			name: $('#name').val(),
			img: $('#img').val(),
			flavor: $('#flav').val(),
			properties: getProperties(),
			triggers: getTriggers(),
			actions: getActions()
		});
		alert('Card pushed to list');
	});

	var property = [];

	property['Spell ender'] = 'STOP';

	function getProperties() {
		let arr = $('#prop_list').find('input'), n = arr.length / 2, res = '';
		for (let i = 0; i < n; ++i) {
			let t = property[arr[i * 2].value] || arr[i * 2].value;
			res += `%${t}`;
		}
		return res;
	}

	function getTriggers() {
		let arr = $('#trig_list').find('input'), n = arr.length / 4, res = '';
		for (let i = 0; i < n; ++i) {
			let trig = arr[i * 4].value,
			    typ = arr[i * 4 + 1].value,
			    tar = arr[i * 4 + 2].value;
			res += `,${trig} ${typ}${tar ? ' ' + tar : ''}`;
		}
		return res.substring(1);
	}

	var action = [];
	action['Life change'] = 'life change';
	action['Draw/discard'] = 'draw or discard';
	action['Add property'] = 'add property';
	action['Add trigger'] = 'add trigger';
	action['Add action'] = 'add action';
	action['Activate'] = 'activate';

	var target = [];
	target['All targets'] = 'notarget';
	target['Owner'] = 'owner';
	target['Opponent'] = 'opponent';

	var param = [];
	param['Combo action'] = '{action combo}';
	param['Combo cards'] = '{card combo}';
	param['Combo triggers'] = '{trigger combo}';

	function getActions() {
		let res = '';
		actIDs.forEach((id) => {
			let act = $(`#act${id}_txt`).val(),
			    tar = $(`#act${id}_tar`).val(),
			    par = act.includes('Add') ? getActionData(id) : $(`#act${id}_par`).val();
			res += `,${action[act] || act}${tar ? ' ' + (target[tar] || tar) : ''}|${param[par] || par}`;
		});
		return res.substring(1);
	};

	function getActionData(id) {
		let oldID = id;
		id = id + '_1';
		switch($(`#act${oldID}_txt`).val()) {
			case 'Add property':
				let txt = $(`#prop${id}_txt`).val();
				return property[txt] || txt;
			case 'Add trigger':
				let trig = $(`#trig${id}_txt`).val(),
				    typ = $(`#trig${id}_typ`).val(),
				    tar = $(`#trig${id}_tar`).val();
				return `${trig} ${typ}${tar ? ' ' + tar : ''}`;
			case 'Add action':
				let act = $(`#act${id}_txt`).val(),
				    targ = $(`#act${id}_tar`).val(),
				    par = act.includes('Add') ? getActionData(id) : $(`#act${id}_par`).val();
				return `${action[act] || act}${targ ? ' ' + (target[targ] || targ) : ''}|${param[par] || par}`;
		}
	};

	var file;

	$('#tbl_pr').click(function() {
		file = new Blob([Papa.unparse(list, { delimiter: ';' })], {type: 'text/plain'});
		alert('Table is ready');
	});

	$('#tbl_s').click(function() {
		if (!file) {
			alert('Table is not ready');
			return;
		}
	    if (window.navigator.msSaveOrOpenBlob) // IE10+
	        window.navigator.msSaveOrOpenBlob(file, 'cards.csv');
	    else { // Others
	    	var a = document.createElement("a"),
                url = window.URL.createObjectURL(file);
	        a.href = url;
	        console.log(url);
	        a.download = 'cards.csv';
	        document.body.appendChild(a);
	        a.click();
	        setTimeout(function() {
	            document.body.removeChild(a);
	            window.URL.revokeObjectURL(url);
	            file = undefined;
	        }, 0);
	    }
	});
});
