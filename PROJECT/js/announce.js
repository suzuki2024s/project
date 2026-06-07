document.getElementById('search').addEventListener('input', function(){
    let rowCount = 0
    document.querySelectorAll('.Announce').forEach(function(row){
        row.classList.remove('color-change');
        if (row.textContent.includes(document.getElementById('search').value)){
            row.style.display = ''
            rowCount = rowCount+1
            if (rowCount %2 === 0){
                row.classList.add('color-change')
            }
        }else {
            row.style.display = 'none'
        }
    });
});

document.getElementById('search').dispatchEvent(new Event('input'));