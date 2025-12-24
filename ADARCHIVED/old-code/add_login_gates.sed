# Add login check to startTruthCannon
/^window\.startTruthCannon = function() {$/{
n
a\    // Login requirement check\
    if (!user) {\
        showToast('Please log in to play!', 'warning');\
        return;\
    }\

}

# Add login check to startBeastBattle (multi-line version)
/^window\.startBeastBattle = function() {$/{
n
/^    showToast/{
i\    // Login requirement check\
    if (!user) {\
        showToast('Please log in to play!', 'warning');\
        return;\
    }\

}
}

# Add login check to openPvPArena (multi-line version)
/^window\.openPvPArena = function() {$/{
n
/^    showToast/{
i\    // Login requirement check\
    if (!user) {\
        showToast('Please log in to play!', 'warning');\
        return;\
    }\

}
}

# Add login check to viewBeastDetails (multi-line version)
/^window\.viewBeastDetails = function() {$/{
n
/^    showToast/{
i\    // Login requirement check\
    if (!user) {\
        showToast('Please log in to play!', 'warning');\
        return;\
    }\

}
}

# Add login check to openBeastLineup (multi-line version)
/^window\.openBeastLineup = function() {$/{
n
/^    showToast/{
i\    // Login requirement check\
    if (!user) {\
        showToast('Please log in to play!', 'warning');\
        return;\
    }\

}
}
