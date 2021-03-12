class EurovisionExtension {
    static inject(tableClassTag = "table.o_table") {
        const table = document.querySelector(tableClassTag);
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");
        const bookmakersRow = thead.children;
        addYouTubeLinkColumn(bookmakersRow);
        const bookmakersList = [...bookmakersRow].slice(2);
        
        const competitorsList = [...tbody.children];
        addSearchField(table);
        setYouTubeLinks(competitorsList);
        setBookmakersSortButtons(bookmakersList)

        function setBookmakersSortButtons(bookmakersList) {
            bookmakersList.forEach((b, i) => {
                let asc = true; 
                b.addEventListener('click', function() {
                    const sorted = sortBookmakers(competitorsList, i + 2, asc);
                    competitorsList.forEach(c => c.remove());
                    sorted.forEach(c => tbody.append(c));
                    asc = asc ? false : true;
                })
            })
    
            function sortBookmakers(competitorsList, i, asc = true) {
                return competitorsList.sort((a, b) => {
                    const firstValue = parseValue(a.children[i].innerText);
                    const secondValue = parseValue(b.children[i].innerText);
                    return asc ? secondValue - firstValue : firstValue - secondValue;
                });
    
                function parseValue(string) {
                    if (string.length) {
                        if (string[0] === "<") return 0;
                        return parseInt(string);
                    }
        
                    return 0;
                }
            }
        }

        function addSearchField(table) {
            const parent = table.parentNode;
            if (parent) {
                const searchFieldLabel = document.createElement('label');
                searchFieldLabel.innerText = "Search field";
                searchFieldLabel.className = "search__label";
                searchFieldLabel.htmlFor = "search";
                searchFieldLabel.style.textAlign = "left";
                searchFieldLabel.style.display = "inline-block";

                const searchField = document.createElement('input');
                searchField.type = "text";
                searchField.className = "search__field";
                searchField.id = "search";
                searchField.style.display = "block";

                searchFieldLabel.append(searchField);
                
                const searchButton = document.createElement('button');
                searchButton.type = 'submit';
                searchButton.className = "search__submit";
                searchButton.innerText = "Search";
                searchButton.style.display = "inline-block";

                const searchForm = document.createElement("form");
                searchForm.className = "search__form";
                searchForm.style.float = "left";
                searchForm.style.marginLeft = "15px";

                searchForm.addEventListener("submit", function(e) {
                    e.preventDefault();
                    const temp = [...competitorsList];
                    if (searchField.value) {
                        const r = new RegExp(`${searchField.value}`,"g");
                        const filteredList = temp.filter(row => {
                            const nameNode = row.children[2].children[0];
                            const countryName = nameNode.childNodes[1]?.nodeValue.trim();
                            const authorName = nameNode.childNodes[2]?.innerText;

                            return r.test(countryName) || r.test(authorName) ? true : false;
                        });

                        temp.forEach(c => c.remove());
                        filteredList.forEach(c => tbody.append(c));
                    } else {
                        temp.forEach(c => c.remove());
                        [...competitorsList].forEach(c => tbody.append(c));
                    }
                });

                searchForm.append(searchFieldLabel);
                searchForm.append(searchButton);
                parent.prepend(searchForm);  
            }          
        }

        function addYouTubeLinkColumn(bookmakersRow) {
            const temp = [...bookmakersRow[1].children];
            const emptyTd = document.createElement("td");
            temp.splice(1, 0, emptyTd);

            const td = document.createElement("td");
            td.className = "ob";
            td.innerText = "YouTube";
            temp.splice(3, 0, td);

            [...thead.children].forEach(c => c.remove());
            temp.forEach(c => thead.append(c));

            const bodyTemp = [...tbody.children];
            bodyTemp.forEach(r => {
                const bodyTd = document.createElement("td");
                const tempRow = [...r.children];
                tempRow.splice(3, 0, bodyTd);
                [...r.children].forEach(c => c.remove());
                tempRow.forEach(t => r.append(t));
            });
        }
        
        function setYouTubeLinks(competitorsList) {
            competitorsList.forEach(c => {
                const youtubeNode = c.children[3];
                const competitorNode = c.children[2];
                const linkNode = competitorNode.children[0];
                const spanNode = linkNode.children[1];

                const text = spanNode?.innerText;
                
                if (text && text.split('-').length > 1) {
                    const youtubeLinkNode = document.createElement("a");
                    youtubeLinkNode.href = `https://www.youtube.com/results?search_query=${spanNode.innerText}`;
                    youtubeLinkNode.style.display = "inline-block";
                    youtubeLinkNode.style.height = "32px";
                    youtubeLinkNode.style.width = "32px";
                    youtubeLinkNode.style.backgroundSize = "contain";
                    youtubeLinkNode.style.width = "32px";
                    youtubeLinkNode.style.backgroundImage = "url('https://i.pinimg.com/originals/de/1c/91/de1c91788be0d791135736995109272a.png')";
                    youtubeNode.append(youtubeLinkNode);
                }
            })
        }
    }
}