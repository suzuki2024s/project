// ---------- 時間割 ----------


// ----- 時間割に講義を登録するためのコード -----

document.querySelectorAll('.classbox-td').forEach(function(select){
    select.addEventListener('click', function(){

        // 再度クリックされたときの処理。(レイアウトをリセットする。)
        if (document.getElementById('subject-input').innerHTML !== ''){
            document.getElementById('subject-input').innerHTML ='';
            document.querySelectorAll('.classbox-td').forEach(function(newselect){
                newselect.classList.remove('active');
            });
            return;
        }
        
        // クリックしたタグをハイライトする。(CSS)
        select.classList.add('active');

        const SubjectInput =
        `<h3>科目名と教室を入力してください。</h3>
        <label for="subject-title">科目名</label>
        <input type="text" id="subject-title" value="" placeholder="科目名"></input>
        <label for="subject-room">教室</label>
        <input type="text" id="subject-room" value="" placeholder="教室"></input>
        <p><span>Enterを押して登録</span><br>(教室の入力欄が選択されている状態でEnterを押してください。)</p>`;
        document.getElementById('subject-input').innerHTML = SubjectInput;

        // tdタグに入っていた内容をinputタグに入れる。
        const TitleInput = document.getElementById('subject-title');
        const RoomInput = document.getElementById('subject-room');
        // brタグで分割し、配列として返す。
        const content = select.innerHTML.split('<br>');
 
        TitleInput.value = content[0] || '';
        RoomInput.value = content[1] || '';

        // inputタグに入力した内容をtdタグに入れる。
        TitleInput.focus()
        TitleInput.addEventListener('keydown', function(enter){
            if (enter.key === 'Enter'){
                RoomInput.focus()
        }});

        RoomInput.addEventListener('keydown', function(enter){
            if (enter.key === 'Enter'){
                select.innerHTML = TitleInput.value + '<br>' + RoomInput.value
                document.getElementById('subject-input').innerHTML ='';
                select.classList.remove('active');
            }
        });
    });   
});




// ---------- スケジュール -----------


// ----- カレンダーを作成するためのコード -----

const year = 2026;
const monthSelect = document.getElementById('month-select');

// selectタグが変更されたとき、カレンダーを作成する。
monthSelect.addEventListener('change', function(){
    let month = Number(monthSelect.value);

    // 1日の日付と曜日を対応させる。最終日の日付を特定する。
    const firstDateBox = new Date(year, month-1, 1);
    const firstDay = firstDateBox.getDay();
    const lastDateBox = new Date(year, month-1+1, 1-1);
    const lastDate = lastDateBox.getDate();

    // HTMLに書き込む内容を変数"week"として作成する。
    let week = '<tr>';

    // 1日が始まる曜日まで空白のtdタグを作成する。
    for (let i = 0; i < firstDay; i++){
        week = week+'<td></td>';
    }

    // (pタグはこれ以降のコードで入力した予定を入れる場所として使う。)
    for (let date = 1; date <= lastDate; date++){
        week = week+`<td class="date-td">${date}<p class="planBox-p"></p></td>`;
        const Day = new Date(year,month-1,date).getDay();
        if (Day === 6 && date !== lastDate){
            week = week+'</tr><tr>';
        }
    }

    week = week+'</tr>';

    document.getElementById('week').innerHTML = week;
});

// selectタグの変更を起こす。(selectタグを変更していない最初の段階でカレンダーを作成させる。)
monthSelect.dispatchEvent(new Event('change'));


// ----- 予定を登録するためのコード -----

// 予定を配列にしてまとめるためのオブジェクト(ブロック)。
const planData = {};

monthSelect.addEventListener('change', function(){
    
    // selectタグ変更前に入力していた予定を復元する。
    document.querySelectorAll('.planBox-p').forEach(function(plan){
        const month = document.getElementById('month-select').value;
        // pタグの親要素であるtdタグを参照する。(=日付を参照する。)
        const date = plan.closest('td').textContent;
        plan.setAttribute('id',`2026-${month}-${date}`);
        // planDataの中に年月日のインデックスで登録されているデータを同じ年月日のidが付いてるpタグに入れる。
        // (登録はこれ以降のコードで行う。)
        const planContent = planData[`2026-${month}-${date}`] || '';
        document.getElementById(`2026-${month}-${date}`).innerHTML = `${planContent}`;
    });
    
    document.querySelectorAll('.date-td').forEach(function(select){
        select.addEventListener('click', function(){

            // 再度クリックが押されたときの処理。
            if (document.getElementById('plan-input').innerHTML !== ''){
                document.getElementById('plan-input').innerHTML ='';
                document.querySelectorAll('.date-td').forEach(function(newselect){
                    newselect.classList.remove('active');
                });
                return;
            }

            // クリックしたタグをハイライトする。(CSS)
            select.classList.add('active');

            const PlanInput =
            `<h3>予定を入力してください。</h3>
            <label for="plan-title">タイトル</label>
            <input type="text" id="plan-title" value="" placeholder="タイトル"></input>
            <label for="plan-memo">メモ</label>
            <input type="text" id="plan-memo" value="" placeholder="メモ"></input>
            <p><span>Enterを押して登録</span><br>(メモの入力欄が選択されている状態でEnterを押してください。)</p>`;
            document.getElementById('plan-input').innerHTML = PlanInput;

            // tdタグの中のpタグに入っていた内容をinputタグに入れる。
            const selectBox = select.querySelector('.planBox-p');
            const planInput = document.getElementById('plan-title');
            const memoInput = document.getElementById('plan-memo');
            // brタグで分割し、配列として返す。
            const content = selectBox.innerHTML.split('<br>');

            planInput.value = content[0] || '';
            memoInput.value = content[1] || '';

            // inputタグに入力した内容をpタグに入れる。
            planInput.focus()
            planInput.addEventListener('keydown', function(enter){
                if (enter.key === 'Enter'){
                    memoInput.focus()
                }
            }); 

            memoInput.addEventListener('keydown', function(enter){
                if (enter.key === 'Enter' && planInput.value !== '' || enter.key === 'Enter' && memoInput.value !== ''){
                    selectBox.innerHTML = planInput.value + '<br>' +memoInput.value;
                    document.getElementById('plan-input').innerHTML ='';
                    // pタグのidを参照したものをインデックスにして、pタグの内容をplanDataに入れる。
                    const dateId = selectBox.getAttribute('id')
                    planData[dateId] = selectBox.innerHTML;
                    select.classList.remove('active');

                }else if (enter.key === 'Enter') {
                    document.getElementById('plan-input').innerHTML ='';
                    select.classList.remove('active');
                }
            });
        });   
    });
});

monthSelect.dispatchEvent(new Event('change'));



// ---------- お知らせ ----------


// --- 検索したお知らせだけを表示させるためのコード(+背景色を交互に付けるためのコード) ---

document.getElementById('search').addEventListener('input', function(){
    let rowCount = 0
    document.querySelectorAll('.Announce').forEach(function(row){
        row.classList.remove('color-change');
        if (row.textContent.includes(document.getElementById('search').value)){
            //displayの設定をリセットする。
            row.style.display = ''
            rowCount = rowCount+1
            // 2で割ったときの余りが0=偶数のとき
            if (rowCount %2 === 0){
                row.classList.add('color-change')
            }
        }else {
            row.style.display = 'none'
        }
    });
});

document.getElementById('search').dispatchEvent(new Event('input'));