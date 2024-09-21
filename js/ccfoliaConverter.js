function ConvertToCcfolia(currentData) {
	if (currentData == null) {
		alert("資料讀取失敗");
		return;
	}
	let jsonData =
	{
		"kind": "character",
		"data": {
			"name": "",
			"memo": "",
			"initiative": 0,
			"externalUrl": "",
			"status": [],
			"params": [],
			"iconUrl": "",
			"faces": [],
			"x": 0,
			"y": 0,
			"angle": 0,
			"width": 4,
			"height": 0,
			"active": true,
			"secret": false,
			"invisible": false,
			"hideStatus": false,
			"color": "#888888",
			"commands": "",
			"owner": ""
		}
	};


	/* 名稱 name */
	{
		jsonData.data.name = currentData["name"];
	}

	/* 角色備註 memo */
	{
		jsonData.data.memo = currentData["remarks"];
	}

	/* 行動力 initiative */
	{
		jsonData.data.initiative = currentData["action"];
	}

	/* 參考網址 externalUrl */
	{
		var sheetURL = currentData["sheet_url"];
		var splitUrl = sheetURL.toString().split('/');
		var id = splitUrl[splitUrl.length - 1].substr(0, splitUrl[splitUrl.length - 1].length - 5);
		var characterURL = "https://lhrpg.com/lhz/pc?id=".concat(id);

		jsonData.data.externalUrl = characterURL;
	}

	/* 變動屬性 status */
	{
		let statusArray = Array();

		var MaxHp = currentData["max_hitpoint"];
		let HP_status = {
			"label": "HP",
			"value": MaxHp,
			"max": MaxHp
		};
		statusArray.push(HP_status);

		let fatigueStatus = {
			"label": "疲勞",
			"value": 0,
			"max": 0
		};
		statusArray.push(fatigueStatus);

		let barrierStatus = {
			"label": "障壁",
			"value": 0,
			"max": 0
		};
		statusArray.push(barrierStatus);

		var fatePoint = currentData["effect"];
		let fateStatus = {
			"label": "因果力",
			"value": fatePoint,
			"max": 0
		};

		statusArray.push(fateStatus);

		jsonData.data.status = statusArray;
	}

	/* 固定屬性 params */
	{
		let paramsArray = Array();

		/*最大HP */

		paramsArray.push({"label": "最大HP",
		"value": currentData["max_hitpoint"].toString(),})

		let keys = ["character_rank/CR", "physical_defense/物防", "magic_defense/魔防",
			"str_value/STR", "dex_value/DEX", "pow_value/POW", "int_value/INT"];

		keys.forEach(key => {
			let keyAndLabel = key.split('/');

			let label = keyAndLabel[1];
			let value = currentData[keyAndLabel[0]].toString();

			let params = {
				"label": label,
				"value": value,
			};

			paramsArray.push(params);
		});

		jsonData.data.params = paramsArray;
	}

	/* 角色圖像 iconUrl */
	{

	}

	/* 立繪差分 faces */
	{

	}

	/* x座標 x ※目前無效 */
	{

	}

	/* y座標 y ※目前無效 */
	{

	}

	/* 角度 angle */
	{

	}

	/* 寬度(圖示大小) width ※檯面上的角色會根據這個數值縮放 */
	{

	}

	/* 高度 height ※會根據角色大小變化 */
	{

	}

	/* 啟用 active ※目前無效 */
	{

	}

	/* 不公開角色狀態 secret */
	{

	}

	/* 發言時不顯示角色立繪 invisible */
	{

	}

	/* 不要在盤面的角色清單中顯示 hideStatus */
	{

	}

	/* 角色顏色 color ※因為不好取得，所以保持預設 */
	{

	}

	/* 常用對話表 commands */
	{
		var commands = "";

		/*數值增減指令*/
		commands = commands.concat(":HP+0 @+HP\n");
		commands = commands.concat(":HP-0 @-HP\n");
		commands = commands.concat(":疲勞+0 @+疲勞\n");
		commands = commands.concat(":疲勞-0 @-疲勞\n");
		commands = commands.concat(":障壁=0 @指定障壁\n");
		commands = commands.concat(":障壁+0 @+障壁\n");
		commands = commands.concat(":障壁-0 @-障壁\n");
		commands = commands.concat(":因果力+0 @+因果力\n");
		commands = commands.concat(":因果力-0 @-因果力\n");

		/*命中判定*/
		let hitLabel = "命中判定";
		let value = ConvertToBCDiceCommand(currentData["abl_hit"]);

		let command = value.concat("　").concat(hitLabel).concat('\n');
		commands = commands.concat(command);

		/*防禦判定*/
		let defKeys = ["abl_avoid/迴避判定", "abl_resist/抵抗判定"];

		defKeys.forEach(key => {
			let keyAndLabel = key.split('/');
			let value = ConvertToBCDiceCommand(currentData[keyAndLabel[0]]);
			let label = keyAndLabel[1];

			let command1 = value.concat("　").concat(label).concat("(高仇恨)\n");
			let command2 = value.concat("+2　").concat(label).concat("(低仇恨)\n");

			commands = commands.concat(command1).concat(command2);
		});

		/*技能判定*/
		let keys = ["abl_motion/運動判定", "abl_durability/耐久判定", "abl_dismantle/解除判定", "abl_operate/操作判定",
			"abl_sense/知覺判定", "abl_negotiate/交涉判定", "abl_knowledge/知識判定", "abl_analyze/解析判定"];

		keys.forEach(key => {
			let keyAndLabel = key.split('/');
			let value = ConvertToBCDiceCommand(currentData[keyAndLabel[0]]);
			let label = keyAndLabel[1];

			let command = value.concat("　").concat(label).concat('\n');

			commands = commands.concat(command);
		});

		commands = commands.concat("2LH+{STR}　STR判定\n2LH+{DEX}　DEX判定\n2LH+{POW}　POW判定\n2LH+{INT}　INT判定\n");
		commands = commands.concat("PCT{CR}　消耗表：體力\nECT{CR}　消耗表：氣力\nGCT{CR}　消耗表：物品\nCCT{CR}　消耗表：金錢\nCTRS{CR}　財寶表：金錢\nMTRS{CR}　財寶表：魔法素材\nITRS{CR}　財寶表：賣錢道具\n");

		/*傷害指令*/
		commands = commands.concat("C(0-{物防})　物理傷害@=傷害-承受傷害前行動-物防-其他\n");
		commands = commands.concat("C(0-{魔防})　魔法傷害@=傷害-承受傷害前行動-魔防-其他");

		jsonData.data.commands = commands;
	}

	/* 持有者 owner ※空欄 */
	{

	}

	let jsonText = JSON.stringify(jsonData);
	copyToClipboard(jsonText);
}
function GetCcfoliaData() {
	/* 主流程 */
	{
		let jsonData =
		{
			"kind": "character",
			"data": {
				"name": "",
				"memo": "",
				"initiative": 0,
				"externalUrl": "",
				"status": [],
				"params": [],
				"iconUrl": "",
				"faces": [],
				"x": 0,
				"y": 0,
				"angle": 0,
				"width": 4,
				"height": 0,
				"active": true,
				"secret": false,
				"invisible": false,
				"hideStatus": false,
				"color": "#888888",
				"commands": "",
				"owner": ""
			}
		};


		/* 名稱 name */
		{
			let nameElement = document.getElementById("character-name").children[1];
			if (nameElement != null) {
				let name = nameElement.textContent;
				let regex = /(.*)\((.*)\)/;
				let matches = name.match(regex);
				name = matches ? matches[1] : name;
				jsonData.data.name = name;
			}

		}

		/* 角色備註 memo */
		{/*
			let memoElement = document.getElementsByClassName('remarks')[0];
			if (memoElement != null) {
				var memo = memoElement.textContent;
				jsonData.data.memo = memo;
			}
*/
		}

		/* 行動力 initiative */
		{/*
			var table = document.getElementsByClassName('nospace')[2];

			let initiativeElement = table.rows[0].cells[1];
			var init = parseInt(initiativeElement.textContent);
			if (init != null) {
				jsonData.data.initiative = init;
			}*/
		}

		/* 參考網址 externalUrl */
		{
			jsonData.data.externalUrl = window.document.location;
		}

		/* 變動屬性 status */
		{
/*			let statusArray = Array();

			var table = document.getElementsByClassName('nospace')[1];

			let HP_Element = table.rows[0].cells[0];
			var MaxHp = parseInt(HP_Element.textContent.substr(6));
			if (MaxHp != null) {
				let HP_status = {
					"label": "HP",
					"value": MaxHp,
					"max": MaxHp
				};

				statusArray.push(HP_status);
			}
			let fatigueStatus = {
				"label": "疲勞",
				"value": 0,
				"max": 0
			};
			statusArray.push(fatigueStatus);

			jsonData.data.status = statusArray;
*/
		}

		/* 固定屬性 params */
		{
/*			let paramsArray = Array();

			var table = document.getElementsByClassName('nospace')[0];

			let CR_Element = table.rows[0].cells[1];
			var CR = CR_Element.textContent.substr(4);

			let params = {
				"label": "CR",
				"value": CR
			};

			paramsArray.push(params);

			table = document.getElementsByClassName('nospace')[2];

			var abilityElement;
			var abilityContent;
			var abilityValue;
			var abilityName = ["物防", "魔防"];

			for (i = 0; i < abilityName.length; i++) {
				abilityElement = table.rows[i + 2].cells[3];
				abilityContent = abilityElement.textContent;
				abilityValue = abilityContent.substr(0, abilityContent.length - 1);

				let params = {
					"label": abilityName[i],
					"value": abilityValue
				};

				paramsArray.push(params);

			}

			jsonData.data.params = paramsArray;*/
		}

		/* 角色圖像 iconUrl */
		{

		}

		/* 立繪差分 faces */
		{

		}

		/* x座標 x ※目前無效 */
		{

		}

		/* y座標 y ※目前無效 */
		{

		}

		/* 角度 angle ※因為不好取得，所以保持預設 */
		{

		}

		/* 寬度(圖示大小) width ※檯面上的角色會根據這個數值縮放 */
		{

		}

		/* 高度 height ※會根據角色大小變化 */
		{

		}

		/* 啟用 active ※目前無效 */
		{

		}

		/* 不公開角色狀態 secret */
		{

		}

		/* 發言時不顯示角色立繪 invisible */
		{

		}

		/* 不要在盤面的角色清單中顯示 hideStatus */
		{

		}

		/* 角色顏色 color ※因為不好取得，所以保持預設 */
		{

		}

		/* 常用對話表 commands */
		{/*
			var table = document.getElementsByClassName('nospace')[3];
			var commands = "";

			let battleSkillElement;
			let battleSkillDiceElement;
			var battleSkillValue;
			var battleSkill;
			var battleSkillNames = ["命中判定", "迴避判定", "抵抗判定"];
			for (i = 0; i < 3; i++) {
				battleSkillElement = table.rows[i].cells[14];
				battleSkillDiceElement = table.rows[i].cells[16];
				battleSkillValue = battleSkillDiceElement.textContent.substr(0, battleSkillDiceElement.textContent.length - 2).concat("LH+").concat(battleSkillElement.textContent.substr(0, battleSkillElement.textContent.length - 1));
				battleSkill = battleSkillValue.concat("　").concat(battleSkillNames[i]);
				if (i != 0) {
					battleSkill = battleSkill.concat("(高仇恨)\n").concat(battleSkillValue).concat("+2　").concat(battleSkillNames[i]).concat("(低仇恨)")
				}

				commands = commands.concat(battleSkill).concat('\n');
			}

			var skillNames = [["運動判定", "耐久判定"],
			["解除判定", "操作判定"],
			["知覺判定", "交涉判定"],
			["知識判定", "解析判定"]];
			let skillElement;
			let skillDiceElement;
			var skill;
			for (i = 0; i < table.rows.length - 1; i++) {
				skillElement = table.rows[i].cells[6];
				skillDiceElement = table.rows[i].cells[8];
				skill = skillDiceElement.textContent.substr(0, skillDiceElement.textContent.length - 2).concat("LH+").concat(skillElement.textContent.substr(0, skillElement.textContent.length - 1)).concat("　").concat(skillNames[i][0]);
				commands = commands.concat(skill).concat('\n');

				skillElement = table.rows[i].cells[10];
				skillDiceElement = table.rows[i].cells[12];
				skill = skillDiceElement.textContent.substr(0, skillDiceElement.textContent.length - 2).concat("LH+").concat(skillElement.textContent.substr(0, skillElement.textContent.length - 1)).concat("　").concat(skillNames[i][1]);
				commands = commands.concat(skill).concat('\n');
			}

			commands = commands.concat("PCT{CR}　消耗表：體力\nECT{CR}　消耗表：氣力\nGCT{CR}　消耗表：物品\nCCT{CR}　消耗表：金錢\nCTRS{CR}　財寶表：金錢\nMTRS{CR}　財寶表：魔法素材\nITRS{CR}　財寶表：賣錢道具");

			jsonData.data.commands = commands;*/
		}

		/* 持有者 owner ※空欄 */
		{

		}

		let jsonText = JSON.stringify(jsonData);
		copyToClipboard(jsonText);
	}
};
/* 將輸入的字串複製到剪貼簿上的函式 */
function copyToClipboard(text) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text).then(function () {
			alert("角色資料已複製到剪貼簿上。");
		});
	}
	else {
		alert("複製失敗，無法取得剪貼簿");
	}
	return;
}

function ConvertToBCDiceCommand(command) {
	let diceRegex = /^((\d(\+\d+)*)\+)?((\d+)[d|D]6?)(\+((\d\+?)*\d))?$/;
	let bcdiceCommand = command.replace(diceRegex, "$5LH+$2$6");
	return bcdiceCommand;
}