document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('translate-btn').addEventListener('click', function() {
        var text = document.getElementById('source-text').value;
        if (text.trim() === "") {
            alert("Terjime etmeli teksti giriziň - Please enter the text to be translated..");
            return;
        }
        var selectedLang = document.getElementById('input-language-selector').value;
        translateText(text, selectedLang);
    });
    
		function translateText(text, sourceLang) {
			console.log('Translating text:', text, 'from', sourceLang); // Debug output
			const url = "https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1";
			const targetLang = document.getElementById('target-language-selector').value; 
			const params = {
				from: sourceLang,
				to: targetLang,
				q: text,
				termIds: ""
			}; 

			const accessToken = '24.35e64e1d2d4282f484477df789b3466e.2592000.1718468829.282335-61567036'; // 替换为你的真实accessToken
			fetch(url + "?access_token=" + accessToken, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(params)
			})
			.then(response => response.json())
			.then(data => {
				console.log('API Response:', data); // 打印API响应
				// 修正：确保正确地访问结果数组
				if (data.error_code || !data.result.trans_result) {
					console.error('API YALŇYŞLYK:', data.error_msg || 'No result found');
					throw new Error(`API YALŇYŞLYK! code: ${data.error_code}, message: ${data.error_msg}`);
				}
				document.getElementById('translation-result').textContent = "Terjime netijesi - Translation: " + data.result.trans_result[0].dst;
			})
			.catch(error => {
				console.error('Error translating:', error);
				document.getElementById('translation-result').textContent = "YALŇYŞLYK: " + error.message;
			});
		}
});
