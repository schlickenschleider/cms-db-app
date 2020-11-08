var activeMenuItem;

function clear_Menu_Selection() {
    $(".layout-menu .nav-link").removeClass("active");
}

function select_Menu_Item(menuName) {
    clear_Menu_Selection();
    $(".layout-menu .nav-link:contains('" + menuName + "')").addClass("active");
}

function clear_Layout_Content() {
    $(".layout-content").empty();
    $(".layout-content").append("<h1>" + activeMenuItem + "</h1>");
}

function search() {
    let filterText = $(".search-input").val();
    load_Menu_Content_Filtered(activeMenuItem, filterText);
}

function load_Menu_Content_Filtered(menuItemName, keyword) {
    let filter = undefined;
    if (keyword !== undefined) {
        filter = (item) => {
            var values = Object.values(item) || [];
            return values.filter(p => ("" + p).indexOf(keyword) > -1).length > 0;
        };
    }
    clear_Layout_Content();
    if (menuItemName === "Leads") load_Menu_Content_For_Leads(filter);
}

function load_Menu_Content_For_Leads(filter) {
    fetch("js/cms-data-leads.json")
        .then(response => response.json())
        .then(json => {
            var items = json;
            var customFieldName = "Status";
            items.forEach((item) => {
                item[customFieldName] = item[customFieldName] || "";
            });

            if (filter != undefined) items = items.filter(filter);

            var htmlContent = create_Table(items, (col, val) => {
                var control = create_Combobox("Default", ["Active", "Follow Up", "Nonactive"]);
                return col === "Status" ? control : val
            });
            $(".layout-content").append(htmlContent);
        });
}

function load_Menu_By_Item_Name(itemName) {
    activeMenuItem = itemName;
    clear_Layout_Content();
    select_Menu_Item(itemName);
    load_Menu_Content_Filtered(itemName);
}

function init_Menu_Item_Event() {
    $(".nav-link").click((e) => {
        let itemName = e.target.text;
        load_Menu_By_Item_Name(itemName);
    });
}
function init_Search_Box() {
    $(".search-input").keyup((e) => {
        search();
    });
}

function create_Combobox(text, options) {
    let content = `
        <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${text}
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                ${options.reduce(
        (prev, curr) => { return prev + `<a class="dropdown-item" href="#">${curr}</a>` }, "")
        }
            </div>
        </div>
    `;
    return content;
}

function create_Table(rows, onFieldRender) {
    let html = "<table class='table table-striped table-hover'>";
    html += '<thead class=table-dark>';
    html += '<tr>';
    for (let j in rows[0]) {
        html += '<th>' + j + '</th>';
    }
    html += '</tr>';
    html += '</thead>';

    html += '<tbody>';
    for (let i = 0; i < rows.length; i++) {
        html += '<tr>';
        for (let j in rows[i]) {
            if (onFieldRender != undefined)
                html += '<td>' + onFieldRender(j, rows[i][j]) + '</td>';
            else
                html += '<td>' + rows[i][j] + '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody>';

    html += '</table>';
    return html;
}

function init() {
    init_Search_Box();
    init_Menu_Item_Event();

    activeMenuItem="Leads"; 
    load_Menu_By_Item_Name(activeMenuItem);
}

$(() => {
    init();
});