var options = {
        announcement: false,
        acceptanceRate: false,
        difficulty: false,
        lockedQuestions: false,
        resultCountNode: true,
        resultCount: 0,
        solvedDifficultyCounts: false
    },
    updateOptions = function (newOptions) {
        if (options.announcement !== newOptions.announcement) {
            toggleAnnouncement(newOptions.announcement);
            options.announcement = newOptions.announcement;
        }

        if (options.acceptanceRate !== newOptions.acceptanceRate) {
            toggleAcceptanceRate(newOptions.acceptanceRate);
            options.acceptanceRate = newOptions.acceptanceRate;
        }

        if (options.difficulty !== newOptions.difficulty) {
            toggleDifficulty(newOptions.difficulty);
            options.difficulty = newOptions.difficulty;
        }

        if (options.lockedQuestions !== newOptions.lockedQuestions) {
            toggleLockedQuestions(newOptions.lockedQuestions);
            options.lockedQuestions = newOptions.lockedQuestions;
        }

        if (options.resultCountNode !== newOptions.resultCountNode) {
            toggleResultCountNode(newOptions.resultCountNode);
            options.resultCountNode = newOptions.resultCountNode;
        }

        if (options.solvedDifficultyCounts !== newOptions.solvedDifficultyCounts) {
            toggleSolvedDifficultyCounts(newOptions.solvedDifficultyCounts);
            options.solvedDifficultyCounts = newOptions.solvedDifficultyCounts;
        }
    },
    toggleAnnouncement = function (show) {
        var announcement = document.getElementById('announcement');

        if (announcement !== null) {
            if (show) {
                announcement.style = '';
            } else {
                announcement.style = 'display: none;';
            }
        }
    },
    toggleAcceptanceRate = function (show) {
        var acceptanceRates = document.querySelectorAll('.reactable-data > tr > td:nth-child(5)'),
            totalAccepted = document.querySelector('.side-bar-list > li:nth-child(3) > span:nth-child(2)'),
            totalSubmissions = document.querySelector('.side-bar-list > li:nth-child(4) > span:nth-child(2)');

        if (show) {
            for (var i = 0; i < acceptanceRates.length; ++i) {
                acceptanceRates[i].style = '';
            }

            if (totalAccepted !== null) {
                totalAccepted.style = 'opacity: 100;';
                totalSubmissions.style = 'opacity: 100;';
            }
        } else {
            for (var i = 0; i < acceptanceRates.length; ++i) {
                acceptanceRates[i].style = 'opacity: 0;';
            }

            if (totalAccepted !== null) {
                totalAccepted.style = 'opacity: 0;';
                totalSubmissions.style = 'opacity: 0;';
            }
        }
    },
    toggleDifficulty = function (show) {
        var difficulties = document.querySelectorAll('.reactable-data > tr > td:nth-child(6)'),
            difficulty = document.querySelector('.side-bar-list > li:nth-child(2) > span:nth-child(2)');

        if (show) {
            for (var i = 0; i < difficulties.length; ++i) {
                difficulties[i].style = '';
            }

            if (difficulty !== null) {
                difficulty.style = 'opacity: 100;';
            }
        } else {
            for (var i = 0; i < difficulties.length; ++i) {
                difficulties[i].style = 'opacity: 0;';
            }

            if (difficulty !== null) {
                difficulty.style = 'opacity: 0;';
            }
        }
    },
    toggleLockedQuestions = function (show) {
        var qlt = document.querySelector('.question-list-table');

        if (qlt) {
            var tbody = qlt.children[0].children[1],
                rows = tbody.children;

            options.resultCount = rows.length;

            for (var i = 0, j = 1; i < rows.length; ++i) {
                var col = rows[i].children[2].children[0].children[1];

                if (show) {
                    rows[i].style = '';
                } else {
                    rows[i].style = j & 1 ? 'background-color: #f5f5f5;' : 'background-color: transparent;';

                    if (col !== undefined && col.children[0] !== undefined) {
                        rows[i].style = 'display: none;'; // removing elements breaks LCs JS...
                        --options.resultCount;
                    } else {
                        ++j;
                    }
                }
            }

            toggleResultCountNode(options.resultCountNode);
        }
    },
    toggleResultCountNode = function (show) {
        var resultCountNode = document.getElementById('resultCountNode');

        if (resultCountNode) {
            if (show) {
                resultCountNode.style = '';
                resultCountNode.innerHTML = options.resultCount;
            } else {
                resultCountNode.style = 'display: none;';
            }
        }
    },
    toggleSolvedDifficultyCounts = function (show) {
        var welcome = document.querySelector('#welcome > span');

        if (welcome) {
            if (show) {
                for (var i = 1; i < welcome.children.length; ++i) {
                    welcome.children[i].style = '';
                }
                welcome.style = '';
            } else {
                for (var i = 1; i < welcome.children.length; ++i) {
                    welcome.children[i].style = 'display: none;';
                }
                welcome.style = 'color: #fff;';
            }
        }
    },
    qaEvent = function () {
        toggleAnnouncement(options.announcement);
        toggleAcceptanceRate(options.acceptanceRate);
        toggleDifficulty(options.difficulty);
        toggleLockedQuestions(options.lockedQuestions);
        toggleResultCountNode(options.resultCountNode);
        toggleSolvedDifficultyCounts(options.solvedDifficultyCounts);
    };

document.addEventListener('DOMContentLoaded', function (e) {
    var qa = document.getElementById('question-app'),
        mo = new MutationObserver(qaEvent);

    if (qa !== null) {
        mo.observe(qa, {childList: true, subtree: true});
        resultCountNode = document.createElement('div');
        resultCountNode.setAttribute('id', 'resultCountNode');
        document.body.appendChild(resultCountNode);
    }

    chrome.storage.sync.get('lc_options', (opts) => {
        if (opts['lc_options'] === undefined) {
            chrome.storage.sync.set({lc_options: opts});
        } else {
            updateOptions(opts['lc_options']);
        }
    });
});

chrome.extension.onMessage.addListener(function(options, sender, object, sendResponse) {
    updateOptions(options);
});
