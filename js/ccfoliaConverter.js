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
		{
			let codeNameElement = document.getElementById("character-name").children[0].children[0];
			if (codeNameElement != null) {
				let codeName = codeNameElement.textContent;
				let regex = /(.*)\((.*)\)/;
				let matches = codeName.match(regex);
				if(matches[1] !== "")
				{
					jsonData.data.memo = jsonData.data.memo + "代號：" + codeName;
				}
			}

			let noteElement = document.getElementById("free-note").children[1]
			if (noteElement != null) {
				jsonData.data.memo = jsonData.data.memo + '\n' + noteElement.textContent;
			}
		}

		/* 行動力 initiative */
		{
			let initiativeElement = document.getElementById('initiative').children[1];
			var init = parseInt(initiativeElement.textContent);
			if (init != null) {
				jsonData.data.initiative = init;
			}
		}

		/* 參考網址 externalUrl */
		{
			jsonData.data.externalUrl = window.document.location;
		}

		/* 變動屬性 status */
		{
			let statusArray = Array();

			let HP_Element = document.getElementById('max-hp').children[1];
			var MaxHp = parseInt(HP_Element.textContent);
			if (MaxHp != null) {
				let HP_status = {
					"label": "HP",
					"value": MaxHp,
					"max": MaxHp
				};

				statusArray.push(HP_status);
			}

			let lifePathTable = document.getElementById('lifepath').children[1];
			let erosionElement = lifePathTable.rows[10].cells[1];
			let erosionRate = parseInt(erosionElement?.textContent);
			
			if (erosionRate != null) {
				let erosionStatus = {
					"label": "侵蝕",
					"value": erosionRate,
					"max": 0
				};

				statusArray.push(erosionStatus);
			}

			//Louis
			let loisTable = document.getElementById('lois').children[1].children[1];
			if (loisTable != null) {
				let loisCount = 0;
				let maxLoisCount = loisTable.rows.length;
				for (i = 0; i < loisTable.rows.length; i++) {
					let lois = loisTable.rows[i].children[0].innerText;
					if(lois !== "")
					{
						loisCount++;
					}
					if(lois === "D露易絲" || lois === "Dロイス")
					{
						maxLoisCount--;
					}
				}
				let loisStatus = {
					"label": "露易絲",
					"value": loisCount,
					"max": maxLoisCount
				};

				statusArray.push(loisStatus);
			}
			
			//財產
			let savingElement = document.getElementById('saving').children[1];
			var saving = parseInt(savingElement.textContent);
			if (saving != null) {
				let savingStatus = {
					"label": "財產",
					"value": saving,
					"max": 0
				};

				statusArray.push(savingStatus);
			}

			let erosionBonus = {
				"label": "侵蝕骰數修正",
				"value": 0,
				"max": 0
			};
			statusArray.push(erosionBonus);

			jsonData.data.status = statusArray;

		}

		let abilityArray = Array();
		let skill2DArray = Array();
		/* 固定屬性 params */
		{
			let paramsArray = Array();

			paramsArray.push({
				"label": "攻擊力",
				"value": "0"
			});
			paramsArray.push({
				"label": "格擋值",
				"value": "0"
			});
			paramsArray.push({
				"label": "裝甲值",
				"value": "0"
			});
			paramsArray.push({
				"label": "閃躲",
				"value": "0"
			});

			let statusBoxElement = document.getElementById('status');
			
			let abilityRootElement = statusBoxElement.children[2].children[0].children[0];

			for (i = 0; i+1 < abilityRootElement.children.length; i+=2) {
				let abilityName = abilityRootElement.children[i].innerText;
				let abilityValue = abilityRootElement.children[i+1].innerText;

				let params = {
					"label": abilityName,
					"value": abilityValue
				};

				paramsArray.push(params);

				abilityArray.push(abilityName);
				skill2DArray.push([]);
			}
			
			let skillRootElement = statusBoxElement.children[2].children[1];
			let fixedSkillRowCpunt = 2;
			let skillRowLength = skillRootElement.firstChild.children.length;
			
			for (j = 0; j+1 < skillRowLength; j+=2) {
				for (i = 0; i < skillRootElement.children.length; i++) {
					let skillRowElement = skillRootElement.children[i];

					let skillName = skillRowElement.children[j].textContent;
					let skillValue = skillRowElement.children[j+1].textContent;

					if(i < fixedSkillRowCpunt &&skillValue === "")
					{
						skillValue = "0";
					}

					if(skillValue !== "")
					{
						let params = {
							"label": skillName,
							"value": skillValue
						};
		
						paramsArray.push(params);
						skill2DArray[j/2].push(skillName);
					}
				}
			}

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
		{
			var commands = "";

			/*數值增減指令*/
			commands = commands.concat(":HP+0 @+HP\n");
			commands = commands.concat(":HP-0 @-HP\n");
			commands = commands.concat(":侵蝕+0 @+侵蝕\n");
			commands = commands.concat(":侵蝕-0 @-侵蝕\n");
			commands = commands.concat(":侵蝕骰數修正=0 @指定侵蝕骰數修正\n");

			for (i = 0; i < abilityArray.length; i++)
			{
				let abilityName = abilityArray[i];

				commands = commands.concat("({" + abilityName +"}" + "+{侵蝕骰數修正}+0)DX(10-0)　【"+ abilityName + "】判定\n");
			}

			for (i = 0; i < abilityArray.length; i++)
			{
				let abilityName = abilityArray[i];
				for (j = 0; j < skill2DArray[i].length; j++)
				{
					let skillName = skill2DArray[i][j];

					commands = commands.concat("({" + abilityName +"}" + "+{侵蝕骰數修正}+0)DX(10-0)+{"+skillName+"}"+"　<"+ skillName + ">判定\n");
				}
			}

			jsonData.data.commands = commands;
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