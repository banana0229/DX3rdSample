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
			let codeNameElement = document.getElementById("character-name").children[0].children[0];
			let codeName = codeNameElement.textContent;
			let regex = /(.*)\((.*)\)/;

			if (codeNameElement != null) {
				let matches = codeName.match(regex);
				if(matches)
				{
					codeName = matches[1];
				}
			}

			let nameElement = document.getElementById("character-name").children[1];
			let name = nameElement.textContent;
			if (nameElement != null) {
				let matches = name.match(regex);
				if(matches)
				{
					name = matches[1];
				}
			}
			jsonData.data.name = name || codeName;
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

				commands = commands.concat(`({${abilityName}}+{侵蝕骰數修正}+0)DX(10-0)　【${abilityName}】判定\n`);
			}

			for (i = 0; i < abilityArray.length; i++)
			{
				let abilityName = abilityArray[i];
				for (j = 0; j < skill2DArray[i].length; j++)
				{
					let skillName = skill2DArray[i][j];

					commands = commands.concat(`({${abilityName}}+{侵蝕骰數修正}+0)DX(10-0)+{${skillName}}　<${skillName}>判定\n`);
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