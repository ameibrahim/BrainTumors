<?php
    function cachebust($file_url = false) {
        // if (!file_exists($file_url)) {
        //     return '8';
        // }

        return time();
    }
