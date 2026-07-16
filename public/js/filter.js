const filters=document.querySelectorAll(".filter");
filters.forEach(filter=>{
    filter.addEventListener("click",()=>{
        const search=filter.dataset.feature;
        window.location.href=`/listing/search?query=${search}`;
    });

});