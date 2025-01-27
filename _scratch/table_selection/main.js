const table = document.getElementById("categoryTable");
const rowNames = Object.freeze(Array.from(document.querySelectorAll('.row_menu input[type="checkbox"]')).map(input => input.value));
const colNames = Object.freeze(Array.from(document.querySelectorAll('.col_menu input[type="checkbox"]')).map(input => input.value));
console.log("rowNames", rowNames);
console.log("colNames", colNames);

const categoryHierarchy = {
    compiled: ['rust', 'haskell'],
    interpreted: ['python', 'haskell'],
    prim_types: ['integer', 'boolean'],
};

// Function to handle subcategory selection
function handleRowSubcategorySelection() {
    const checkboxes = document.querySelectorAll('.row_menu input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const category = checkbox.value;
            if (categoryHierarchy[category]) { // If it's a supercategory
                const subcategories = categoryHierarchy[category];
                subcategories.forEach(subcategory => {
                    const subCheckbox = Array.from(checkboxes).find(cb => cb.value === subcategory);
                    if (subCheckbox) {
                        subCheckbox.checked = checkbox.checked; // Sync subcategory with supercategory
                    }
                });
            }
            filterTableRows(); // Reapply column filtering
        });
    });
}
function handleColumnSubcategorySelection() {
    const checkboxes = document.querySelectorAll('.col_menu input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const category = checkbox.value;
            if (categoryHierarchy[category]) { // If it's a supercategory
                const subcategories = categoryHierarchy[category];
                subcategories.forEach(subcategory => {
                    const subCheckbox = Array.from(checkboxes).find(cb => cb.value === subcategory);
                    if (subCheckbox) {
                        subCheckbox.checked = checkbox.checked; // Sync subcategory with supercategory
                    }
                });
            }
            filterTableColumns(); // Reapply column filtering
        });
    });
}
handleRowSubcategorySelection();
handleColumnSubcategorySelection();

/*
function invertMapping(obj) {
    // invert mapping
    const inversed = {};
    for (const [k, vs] of Object.entries(d)) {
        for (const v of vs) {
            if (!(v in inversed)) {
                inversed[v] = [];
            }
            inversed[v].push(k);
        }
    }
}


function mappingFromHierarchy(hierarchy) {

}

// const langClasses = {
//     interpreted: ["python", "haskell"],
//     compiled: ["rust", "haskell"]
// };


async function loadJSON(jsonPath) {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Loaded JSON:', langClasses);
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
    return result
}

const langClasses = loadJSON('./language-classes.json');
const langTags = invertMapping(langClasses);
const rowStructure = loadJSON('./row-structure.json');
const rowTags = mappingFromHierarchy(rowStructure);
*/


function toggleOutput() {
    document.querySelectorAll('.output').forEach(el => {
        if (el.textContent === '') {
            text = el.getAttribute('data-original');
            el.innerHTML = `<br><span class="output_prefix">❯&nbsp;</span><span class="output_substance">${text}</span>`;
        } else {
            el.setAttribute('data-original', el.innerHTML
                .replace(/^<br><span class="output_prefix">❯&nbsp;<\/span><span class="output_substance">/g, '')
                .replace(/^<\/span>/g, '')
            );
            el.textContent = '';
        }
    });
}

function toggleBoilerplate() {
    document.querySelectorAll('.boilerplate').forEach(el => {
        if (el.textContent === '') {
            text = el.getAttribute('data-original');
            el.innerHTML = `${text}<br>`;
        } else {
            el.setAttribute('data-original', el.textContent);
            el.textContent = '';
        }
    });

    document.querySelectorAll('.indent_if_bp').forEach(el => {
        if (el.innerHTML.startsWith('&nbsp;&nbsp;&nbsp;&nbsp;')) {
            el.innerHTML = el.innerHTML.replace(/^&nbsp;&nbsp;&nbsp;&nbsp;/g, '');
        }
        else {
            el.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + el.innerHTML;
        }
    });

}

function filterTableRows() {
    const selectedRows = Array.from(document.querySelectorAll('.row_menu input[type="checkbox"]'))
        .filter(input => input.checked && input.closest('.dropdown').querySelector('button').textContent.includes('Row'))
        .map(input => input.value);

    // table.querySelectorAll("tbody tr").forEach(row => {
    //     const rowCategory = row.dataset.category; // Get the category from the row's data attribute
    //     row.classList.toggle("hidden", !selectedRows.includes(rowCategory)); // Toggle visibility of the row
    // });

    table.querySelectorAll("tbody tr").forEach(row => {
        const rowCategories = row.dataset.category.split(" "); // Split the categories into an array
        const hasMatch = rowCategories.some(category => selectedRows.includes(category)); // Check if any category matches
        row.classList.toggle("hidden", !hasMatch); // Toggle visibility of the row
    });

    console.log("selectedRows:", selectedRows);
}

// Updated filterTableColumns function
function filterTableColumns() {
    const selectedColumns = Array.from(document.querySelectorAll('.col_menu input[type="checkbox"]'))
        .filter(input => input.checked && input.closest('.dropdown').querySelector('button').textContent.includes('Languages'))
        .map(input => input.value);
    const columnIndexesToHide = [];

    table.querySelectorAll("thead th").forEach((th, colIndex) => {
        if (colIndex > 0) { // Skip the first column (row labels)
            const colCategory = th.dataset.category; // Get the category from the column header
            const shouldHide = !selectedColumns.includes(colCategory); // Determine if the column should be hidden
            if (shouldHide) {
                columnIndexesToHide.push(colIndex); // Add column index to hide list
            }
            th.classList.toggle("hidden", shouldHide); // Hide/show the column header
        }
    });

    table.querySelectorAll("tbody tr").forEach(row => {
        row.querySelectorAll("td").forEach((td, colIndex) => {
            if (colIndex > 0) { // Skip the first column (row labels)
                const shouldHide = columnIndexesToHide.includes(colIndex); // Check if column index is in the hide list
                td.classList.toggle("hidden", shouldHide); // Toggle visibility of the cell
            }
        });
    });

    console.log("selectedColumns:", selectedColumns);
}

// function filterTableColumns() {
//     const selectedColumns = Array.from(document.querySelectorAll('.col_menu input[type="checkbox"]'))
//         .filter(input => input.checked && input.closest('.dropdown').querySelector('button').textContent.includes('Languages'))
//         .map(input => input.value);
//     const columnIndexesToHide = [];

//     table.querySelectorAll("thead th").forEach((th, colIndex) => {
//         if (colIndex > 0) { // Skip the first column (row labels)
//             const colCategory = th.dataset.category; // Get the category from the column header
//             const shouldHide = !selectedColumns.includes(colCategory); // Determine if the column should be hidden
//             if (shouldHide) {
//                 columnIndexesToHide.push(colIndex); // Add column index to hide list
//             }
//             th.classList.toggle("hidden", shouldHide); // Hide/show the column header
//         }
//     });

//     table.querySelectorAll("tbody tr").forEach(row => {
//         row.querySelectorAll("td").forEach((td, colIndex) => {
//             if (colIndex > 0) { // Skip the first column (row labels)
//                 const shouldHide = columnIndexesToHide.includes(colIndex); // Check if column index is in the hide list
//                 td.classList.toggle("hidden", shouldHide); // Toggle visibility of the cell
//             }
//         });
//     });

//     console.log("selectedColumns:", selectedColumns);
// }

document.querySelectorAll('.row_menu input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterTableRows);
});

document.querySelectorAll('.col_menu input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterTableColumns);
});

document.getElementById('boilerplateToggle')
    .addEventListener('change', toggleBoilerplate);

document.getElementById('outputToggle')
    .addEventListener('change', toggleOutput);

document.querySelectorAll('.dropdown button').forEach(button => {
    button.addEventListener('click', () => {
        const dropdown = button.parentElement;
        dropdown.classList.toggle('open');
    });
});

document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
});