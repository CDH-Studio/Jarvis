/*
 * JTSage-DateBox-4.1.2
 * For: {"jqm":"1.4.5","bootstrap":"3.3.7"}
 * Date: Sun Jun 18 2017 14:28:10 UTC
 * http://dev.jtsage.com/DateBox/
 * https://github.com/jtsage/jquery-mobile-datebox
 *
 * Copyright 2010, 2017 JTSage. and other contributors
 * Released under the MIT license.
 * https://github.com/jtsage/jquery-mobile-datebox/blob/master/LICENSE.txt
 *
 */

(function($) {
    $.widget("jtsage.datebox", {
        initSelector: "input[data-role='datebox']",
        options: {
            version: "4.1.2",
            jqmVersion: "1.4.5",
            bootstrapVersion: "3.3.7",
            bootstrap4Version: "4.0.0a6",
            jqmuiWidgetVersion: "1.11.4",
            theme: false,
            themeDefault: "a",
            themeHeader: "a",
            themeSetButton: "a",
            themeCloseButton: "secondary",
            mode: false,
            transition: "fade",
            useAnimation: true,
            hideInput: false,
            hideContainer: false,
            lockInput: true,
            zindex: "1100",
            clickEvent: "click",
            clickEventAlt: "click",
            useKinetic: true,
            defaultValue: false,
            showInitialValue: true,
            linkedField: false,
            linkedFieldFormat: "%J",
            popupPosition: false,
            popupButtonPosition: "left",
            popupForceX: false,
            popupForceY: false,
            useModal: true,
            useModalTheme: "b",
            useInline: false,
            useInlineBlind: false,
            useHeader: true,
            useImmediate: false,
            useButton: true,
            buttonIcon: false,
            useFocus: false,
            useSetButton: true,
            useCancelButton: false,
            useTodayButton: false,
            useTomorrowButton: false,
            useClearButton: false,
            useCollapsedBut: false,
            usePlaceholder: false,
            beforeOpenCallback: false,
            beforeOpenCallbackArgs: [],
            openCallback: false,
            openCallbackArgs: [],
            closeCallback: false,
            closeCallbackArgs: [],
            startOffsetYears: false,
            startOffsetMonths: false,
            startOffsetDays: false,
            afterToday: true,
            beforeToday: false,
            notToday: false,
            maxDays: false,
            minDays: false,
            maxYear: false,
            minYear: false,
            blackDates: false,
            blackDatesRec: false,
            blackDays: false,
            whiteDates: true,
            minHour: false,
            maxHour: false,
            minTime: false,
            maxTime: false,
            maxDur: false,
            minDur: false,
            minuteStep: 1,
            minuteStepRound: 0,
            rolloverMode: {
                m: true,
                d: true,
                h: true,
                i: true,
                s: true
            },
            useLang: "default",
            lang: {
                "default": {
                    setDateButtonLabel: "Set Date",
                    setTimeButtonLabel: "Set Time",
                    setDurationButtonLabel: "Set Duration",
                    todayButtonLabel: "Jump to Today",
                    tomorrowButtonLabel: "Jump to Tomorrow",
                    titleDateDialogLabel: "Set Date",
                    titleTimeDialogLabel: "Set Time",
                    daysOfWeek: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
                    daysOfWeekShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
                    monthsOfYear: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                    monthsOfYearShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                    durationLabel: [ "Days", "Hours", "Minutes", "Seconds" ],
                    durationDays: [ "Day", "Days" ],
                    timeFormat: 12,
                    headerFormat: "%A, %B %-d, %Y",
                    tooltip: "",
                    nextMonth: "Next Month",
                    prevMonth: "Previous Month",
                    dateFieldOrder: [ "m", "d", "y" ],
                    timeFieldOrder: [ "h", "i", "a" ],
                    slideFieldOrder: [ "y", "m", "d" ],
                    dateFormat: "%Y-%m-%d",
                    useArabicIndic: false,
                    isRTL: false,
                    calStartDay: 0,
                    clearButton: "Clear",
                    cancelButton: "Cancel",
                    durationOrder: [ "d", "h", "i", "s" ],
                    meridiem: [ "AM", "PM" ],
                    timeOutput: "%k:%M",
                    durationFormat: "%Dd %DA, %Dl:%DM:%DS",
                    calDateListLabel: "Other Dates",
                    calHeaderFormat: "%B %Y"
                }
            },
            themeDateToday: "info",
            themeDayHigh: "warning",
            themeDatePick: "info",
            themeDateHigh: "warning",
            themeDateHighAlt: "danger",
            themeDateHighRec: "warning",
            themeDate: "secondary",
            themeButton: "secondary",
            themeInput: "default",
            themeClearButton: "secondary",
            themeCancelButton: "secondary",
            themeTomorrowButton: "secondary",
            themeTodayButton: "secondary",
            buttonIconDate: "calendar-alt fa-lg",
            buttonIconTime: "clock ",
            disabledState: "disabled",
            bootstrapDropdown: true,
            bootstrapDropdownRight: true,
            bootstrapModal: false,
            calNextMonthIcon: "angle-right",
            calPrevMonthIcon: "angle-left",
            useInlineAlign: "left",
            btnCls: "btn btn-sm btn-cal-",
            icnCls: " far fa-",
            s: {
                cal: {
                    prevMonth: "<span title='{text}' class='fa fa-{icon}'></span>",
                    nextMonth: "<span title='{text}' class='fa fa-{icon}'></span>",
                    botButton: "<a href='#' class='{cls}' role='button'><span class='{icon}'></span> {text}</a>"
                }
            },
            tranDone: "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            calHighToday: true,
            calHighPick: true,
            calShowDays: true,
            calOnlyMonth: false,
            calWeekMode: false,
            calWeekModeDay: 1,
            calControlGroup: false,
            calShowWeek: false,
            calUsePickers: false,
            calNoHeader: false,
            calFormatter: false,
            calAlwaysValidateDates: false,
            calYearPickMin: -6,
            calYearPickMax: 6,
            calYearPickRelative: true,
            calBeforeAppendFunc: function(t) {
                return t;
            },
            highDays: false,
            highDates: false,
            highDatesRec: false,
            highDatesAlt: false,
            enableDates: false,
            calDateList: false,
            calShowDateList: false,
            validHours: false,
            repButton: true,
            durationStep: 1,
            durationSteppers: {
                d: 1,
                h: 1,
                i: 1,
                s: 1
            },
            flen: {
                y: 25,
                m: 24,
                d: 40,
                h: 24,
                i: 30,
                s: 30
            },
            slen: {
                y: 9,
                m: 14,
                d: 16,
                h: 16,
                i: 30
            }
        },
        _getLongOptions: function(element) {
            var key, temp, returnObj = {}, prefix = "datebox", prefixLength = 7;
            for (key in element.data()) {
                if (key.substr(0, prefixLength) === prefix && key.length > prefixLength) {
                    temp = key.substr(prefixLength);
                    temp = temp.charAt(0).toLowerCase() + temp.slice(1);
                    if (temp !== "options") {
                        returnObj[temp] = element.data(key);
                    }
                }
            }
            return returnObj;
        },
        _setOption: function() {
            $.Widget.prototype._setOption.apply(this, arguments);
            this.refresh();
        },
        getOption: function(opt) {
            var i18nTester = this.__(opt);
            if (i18nTester !== "Err:NotFound") {
                return i18nTester;
            } else {
                return this.options[opt];
            }
        },
        baseMode: "bootstrap4",
        _stdBtn: {
            cancel: function() {
                var w = this, o = this.options;
                return $("<a href='#' role='button' class='btn btn-" + o.themeCancelButton + "'><span class='" + o.icnCls + "remove'></span> " + w.__("cancelButton") + "</a>").on(o.clickEventAlt, function(e) {
                    e.preventDefault();
                    w._t({
                        method: "close",
                        closeCancel: true
                    });
                });
            },
            clear: function() {
                var w = this, o = this.options;
                return $("<a href='#' role='button' class='btn btn-" + o.themeClearButton + "'><span class='" + o.icnCls + "eraser'></span> " + w.__("clearButton") + "</a>").on(o.clickEventAlt, function(e) {
                    e.preventDefault();
                    w.d.input.val("");
                    w._t({
                        method: "clear"
                    });
                    w._t({
                        method: "close",
                        closeCancel: true
                    });
                });
            },
            close: function(txt, trigger) {
                var w = this, o = this.options;
                if (typeof trigger === "undefined") {
                    trigger = false;
                }
                return $("<a href='#' role='button' class='btn btn-" + o.themeCloseButton + "'><span class= 'far fa-clock mr-1'></span>  " + txt + "</a>").addClass("" + (w.dateOK === true ? "" : "disabled")).on(o.clickEventAlt, function(e) {
                    e.preventDefault();
                    if (w.dateOK === true) {
                        if (trigger === false) {
                            w._t({
                                method: "set",
                                value: w._formatter(w.__fmt(), w.theDate),
                                date: w.theDate
                            });
                        } else {
                            w._t(trigger);
                            console.log('here3');
                        }
                        w._t({
                            method: "close",
                            closeCancel: true
                        });
                        console.log('here4');
                    }
                });
            },
            today: function() {
                var w = this, o = this.options;
                return $("<a href='#' role='button' class='btn btn-" + o.themeTodayButton + "'><span class='" + o.icnCls + "send'></span> " + w.__("todayButtonLabel") + "</a>").on(o.clickEventAlt, function(e) {
                    e.preventDefault();
                    w.theDate = w._pa([ 0, 0, 0 ], new w._date());
                    w.calBackDate = false;
                    w._t({
                        method: "doset"
                    });
                });
            },
            tomorrow: function() {
                var w = this, o = this.options;
                return $("<a href='#' role='button' class='btn btn-" + o.themeTomorrowButton + "'><span class='" + o.icnCls + "send'></span> " + w.__("tomorrowButtonLabel") + "</a>").on(o.clickEventAlt, function(e) {
                    e.preventDefault();
                    w.theDate = w._pa([ 0, 0, 0 ], new w._date()).adj(2, 1);
                    w.calBackDate = false;
                    w._t({
                        method: "doset"
                    });
                });
            }
        },
        _destroy: function() {
            var w = this, o = this.options, button = this.d.wrap.find(".input-group-addon");
            if (o.useButton === true) {
                button.remove();
                w.d.input.unwrap();
            }
            if (o.lockInput) {
                w.d.input.removeAttr("readonly");
            }
            w.d.input.off("datebox").off("focus.datebox").off("blur.datebox").off("change.datebox");
            $(document).off(w.drag.eMove).off(w.drag.eEnd).off(w.drag.eEndA);
        },
        _create: function() {
            $(document).trigger("dateboxcreate");
            var w = this, o = $.extend(this.options, this._getLongOptions(this.element), this.element.data("options")), thisTheme = o.theme === false ? "default" : o.theme, d = {
                input: this.element,
                wrap: this.element.parent(),
                mainWrap: $("<div>", {
                    "class": "ui-datebox-container shadow"
                }).css("zIndex", o.zindex),
                intHTML: false
            }, evtid = ".datebox" + this.uuid, touch = typeof window.ontouchstart !== "undefined", drag = {
                eStart: "touchstart" + evtid + " mousedown" + evtid,
                eMove: "touchmove" + evtid + " mousemove" + evtid,
                eEnd: "touchend" + evtid + " mouseup" + evtid,
                eEndA: true ? [ "mouseup", "touchend", "touchcanel", "touchmove" ].join(evtid + " ") + evtid : "mouseup" + evtid,
                move: false,
                start: false,
                end: false,
                pos: false,
                target: false,
                delta: false,
                tmp: false
            };
            $.extend(w, {
                d: d,
                drag: drag,
                touch: touch
            });
            if (o.usePlaceholder !== false) {
                if (o.usePlaceholder === true && w._grabLabel() !== "") {
                    w.d.input.attr("placeholder", w._grabLabel());
                }
                if (typeof o.usePlaceholder === "string") {
                    w.d.input.attr("placeholder", o.usePlaceholder);
                }
            }
            o.theme = thisTheme;
            w.cancelClose = false;
            w.calBackDate = false;
            w.calDateVisible = true;
            w.disabled = false;
            w.runButton = false;
            w._date = window.Date;
            w._enhanceDate();
            w.baseID = w.d.input.attr("id");
            w.initDate = new w._date();
            w.initDate.setMilliseconds(0);
            w.theDate = o.defaultValue ? w._makeDate() : w.d.input.val() !== "" ? w._makeDate(w.d.input.val()) : new w._date();
            if (w.d.input.val() === "") {
                w._startOffset(w.theDate);
            }
            w.initDone = false;
            if (o.showInitialValue) {
                w.d.input.val(w._formatter(w.__fmt(), w.theDate));
            }
            w.d.wrap = w.d.input.wrap("<div class='input-group'>").parent();
            if (o.mode !== false) {
                if (o.buttonIcon === false) {
                    if (o.mode.substr(0, 4) === "time" || o.mode.substr(0, 3) === "dur") {
                        o.buttonIcon = o.buttonIconTime;
                    } else {
                        o.buttonIcon = o.buttonIconDate;
                    }
                }
            }
            if (o.useButton) {
                $("<div class='input-group-addon custom-date-btn'>" + "<span class='" + o.icnCls + o.buttonIcon + "'></span>" + "</div>").attr("title", w.__("tooltip")).on(o.clickEvent, function(e) {
                    e.preventDefault();
                    if (o.useFocus) {
                        w.d.input.focus();
                    } else {
                        if (!w.disabled) {
                            w._t({
                                method: "open"
                            });
                        }
                    }
                }).appendTo(w.d.wrap);
            } else {
                w.d.wrap.css("width", "100%");
            }
            if (o.hideInput) {
                w.d.wrap.hide();
            }
            if (o.hideContainer) {
                w.d.wrap.parent().hide();
            }
            w.d.input.on("focus.datebox", function() {
                w.d.input.addClass("ui-focus");
                if (w.disabled === false && o.useFocus) {
                    w._t({
                        method: "open"
                    });
                }
            }).on("blur.datebox", function() {
                w.d.input.removeClass("ui-focus");
            }).on("change.datebox", function() {
                w.theDate = w._makeDate(w.d.input.val());
                w.refresh();
            }).on("datebox", w._event);
            if (o.lockInput) {
                // w.d.input.attr("readonly", "readonly");
            }
            if (typeof $.event.special.mousewheel !== "undefined") {
                w.wheelExists = true;
            }
            if (w.d.input.is(":disabled")) {
                w.disable();
            }
            w.applyMinMax(false, false);
            if (o.useInline || o.useInlineBlind) {
                w.open();
            }
            $(document).trigger("dateboxaftercreate");
        },
        open: function() {
            var w = this, o = this.options, basepop = {};
            if (o.useFocus && w.fastReopen === true) {
                w.d.input.blur();
                return false;
            }
            w.theDate = w._makeDate(w.d.input.val());
            w.calBackDate = false;
            if (w.d.input.val() === "") {
                w._startOffset(w.theDate);
            }
            w.d.input.blur();
            if (typeof w._build[o.mode] === "undefined") {
                w._build["default"].apply(w, []);
            } else {
                w._build[o.mode].apply(w, []);
            }
            if (typeof w._drag[o.mode] !== "undefined") {
                w._drag[o.mode].apply(w, []);
            }
            w._t({
                method: "refresh"
            });
            if (w.__("useArabicIndic") === true) {
                w._doIndic();
            }
            if ((o.useInline || o.useInlineBlind) && w.initDone === false) {
                w.d.mainWrap.append(w.d.intHTML);
                if (o.hideContainer) {
                    if (o.useHeader) {
                        w.d.mainWrap.prepend($(w._spf("<div class='{c1}'><h4 class='{c2}'>{text}</h4></div>", {
                            c1: "modal-header",
                            c2: "modal-title text-center",
                            text: w.d.headerText
                        })));
                    }
                    w.d.wrap.parent().after(w.d.mainWrap);
                } else {
                    w.d.wrap.parent().append(w.d.mainWrap);
                }
                switch (o.useInlineAlign) {
                  case "right":
                    w.d.mainWrap.css({
                        marginRight: 0,
                        marginLeft: "auto"
                    });
                    break;

                  case "left":
                    w.d.mainWrap.css({
                        marginLeft: 0,
                        marginRight: "auto"
                    });
                    break;

                  case "center":
                  case "middle":
                    w.d.mainWrap.css({
                        marginLeft: "auto",
                        marginRight: "auto"
                    });
                    break;
                }
                w.d.mainWrap.removeClass("ui-datebox-hidden ui-overlay-shadow");
                if (o.useInline) {
                    w.d.mainWrap.addClass("ui-datebox-inline").css("zIndex", "auto");
                    if (!o.hideInput && !o.hideContainer) {
                        w.d.mainWrap.addClass("ui-datebox-inline-has-input");
                    }
                    setTimeout(function(w) {
                        return function() {
                            w._t({
                                method: "postrefresh"
                            });
                        };
                    }(w), 100);
                    return true;
                } else {
                    w.d.mainWrap.addClass("ui-datebox-inline ui-datebox-inline-has-input").css("zIndex", "auto");
                    w.d.mainWrap.hide();
                }
                w.initDone = false;
                w._t({
                    method: "postrefresh"
                });
            }
            if (o.useInlineBlind) {
                if (w.initDone) {
                    w.refresh();
                    w.d.mainWrap.slideDown();
                    w._t({
                        method: "postrefresh"
                    });
                } else {
                    w.initDone = true;
                }
                return true;
            }
            if (w.d.intHTML.is(":visible")) {
                return false;
            }
            w.d.mainWrap.empty();
            w.d.mainWrap.append(w.d.intHTML).css("zIndex", o.zindex);
            w._t({
                method: "postrefresh"
            });
            if (o.openCallback !== false) {
                if (!$.isFunction(o.openCallback)) {
                    if (typeof window[o.openCallback] === "function") {
                        o.openCallback = window[o.openCallback];
                    }
                }
                basepop.afteropen = function() {
                    w._t({
                        method: "postrefresh"
                    });
                    if (o.openCallback.apply(w, $.merge([ {
                        custom: w.customCurrent,
                        initDate: w.initDate,
                        date: w.theDate,
                        duration: w.lastDuration
                    } ], o.openCallbackArgs)) === false) {
                        w._t({
                            method: "close"
                        });
                    }
                };
            } else {
                basepop.afteropen = function() {
                    w._t({
                        method: "postrefresh"
                    });
                };
            }
            if (o.beforeOpenCallback !== false) {
                if (!$.isFunction(o.beforeOpenCallback)) {
                    if (typeof window[o.beforeOpenCallback] === "function") {
                        o.beforeOpenCallback = window[o.beforeOpenCallback];
                    }
                }
                if (o.beforeOpenCallback.apply(w, $.merge([ {
                    custom: w.customCurrent,
                    initDate: w.initDate,
                    date: w.theDate,
                    duration: w.lastDuration
                } ], o.beforeOpenCallbackArgs)) === false) {
                    return false;
                }
            }
            if (o.bootstrapDropdown === true && o.bootstrapModal === false) {
                w.d.mainWrap.addClass("dropdown-menu").addClass(o.useAnimation ? o.transition : "").addClass(o.bootstrapDropdownRight === true ? "dropdown-menu-right" : "").appendTo(w.d.wrap).on(o.tranDone, function() {
                    if (w.d.mainWrap.is(":visible")) {
                        basepop.afteropen.call();
                    } else {
                        basepop.afterclose.call();
                        w.d.wrap.removeClass("show");
                    }
                });
                w.d.wrap.addClass("show");
                w.d.backdrop = $("<div class='jtsage-datebox-backdrop-div'></div>").css({
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0
                }).appendTo("body").on(o.clickEvent, function(e) {
                    e.preventDefault();
                    w._t({
                        method: "close",
                        closeCancel: true
                    });
                });
                window.setTimeout(function() {
                    w.d.mainWrap.addClass("show");
                }, 0);
            }
        },
        close: function() {
            var w = this, o = this.options, basepop = {};
            w.calBackDate = false;
            if (o.useInlineBlind) {
                w.d.mainWrap.slideUp();
                return true;
            }
            if (o.useInline || w.d.intHTML === false) {
                return true;
            }
            if (o.closeCallback !== false) {
                if (!$.isFunction(o.closeCallback)) {
                    if (typeof window[o.closeCallback] === "function") {
                        o.closeCallback = window[o.closeCallback];
                    }
                }
                basepop.afterclose = function() {
                    o.closeCallback.apply(w, $.merge([ {
                        custom: w.customCurrent,
                        initDate: w.initDate,
                        date: w.theDate,
                        duration: w.lastDuration,
                        cancelClose: w.cancelClose
                    } ], o.closeCallbackArgs));
                };
            } else {
                basepop.afterclose = function() {
                    return true;
                };
            }
            if (o.bootstrapDropdown === true && o.bootstrapModal === false) {
                if (o.useAnimation === true) {
                    w.d.mainWrap.removeClass("show");
                    w.d.backdrop.remove();
                    $(".jtsage-datebox-backdrop-div").remove();
                    window.setTimeout(function() {
                        w.d.wrap.removeClass("show");
                        basepop.afterclose.call();
                    }, 0);
                } else {
                    w.d.wrap.removeClass("show");
                    w.d.backdrop.remove();
                    $(".jtsage-datebox-backdrop-div").remove();
                    basepop.afterclose.call();
                }
            }
            $(document).off(w.drag.eMove).off(w.drag.eEnd).off(w.drag.eEndA);
            if (o.useFocus) {
                w.fastReopen = true;
                setTimeout(function(t) {
                    return function() {
                        t.fastReopen = false;
                    };
                }(w), 300);
            }
        },
        disable: function() {
            var w = this;
            w.d.input.attr("disabled", true);
            w.disabled = true;
            w._t({
                method: "disable"
            });
        },
        enable: function() {
            var w = this;
            w.d.input.attr("disabled", false);
            w.disabled = false;
            w._t({
                method: "enable"
            });
        },
        _controlGroup: function(element) {
            var o = this.options;
            if (o.useCollapsedBut) {
                element.find("a").css({
                    width: "auto"
                });
                element.addClass("btn-group btn-group-justified");
            } else {
                element.addClass("btn-group-vertical");
            }
            return element;
        },
        _enhanceDate: function() {
            $.extend(this._date.prototype, {
                copy: function(adjust, override) {
                    adjust = $.extend([ 0, 0, 0, 0, 0, 0, 0 ], adjust);
                    override = $.extend([ 0, 0, 0, 0, 0, 0, 0 ], override);
                    return new Date(override[0] > 0 ? override[0] : this.get(0) + adjust[0], override[1] > 0 ? override[1] : this.get(1) + adjust[1], override[2] > 0 ? override[2] : this.get(2) + adjust[2], override[3] > 0 ? override[3] : this.get(3) + adjust[3], override[4] > 0 ? override[4] : this.get(4) + adjust[4], override[5] > 0 ? override[5] : this.get(5) + adjust[5], override[6] > 0 ? override[5] : this.get(6) + adjust[6]);
                },
                adj: function(type, amount) {
                    if (typeof amount !== "number" || typeof type !== "number") {
                        throw new Error("Invalid Arguments");
                    }
                    switch (type) {
                      case 0:
                        this.setD(0, this.get(0) + amount);
                        break;

                      case 1:
                        this.setD(1, this.get(1) + amount);
                        break;

                      case 2:
                        this.setD(2, this.get(2) + amount);
                        break;

                      case 3:
                        amount *= 60;

                      case 4:
                        amount *= 60;

                      case 5:
                        amount *= 1e3;

                      case 6:
                        this.setTime(this.getTime() + amount);
                        break;
                    }
                    return this;
                },
                setD: function(type, amount) {
                    switch (type) {
                      case 0:
                        this.setFullYear(amount);
                        break;

                      case 1:
                        this.setMonth(amount);
                        break;

                      case 2:
                        this.setDate(amount);
                        break;

                      case 3:
                        this.setHours(amount);
                        break;

                      case 4:
                        this.setMinutes(amount);
                        break;

                      case 5:
                        this.setSeconds(amount);
                        break;

                      case 6:
                        this.setMilliseconds(amount);
                        break;
                    }
                    return this;
                },
                get: function(type) {
                    switch (type) {
                      case 0:
                        return this.getFullYear();

                      case 1:
                        return this.getMonth();

                      case 2:
                        return this.getDate();

                      case 3:
                        return this.getHours();

                      case 4:
                        return this.getMinutes();

                      case 5:
                        return this.getSeconds();

                      case 6:
                        return this.getMilliseconds();
                    }
                    return false;
                },
                get12hr: function() {
                    if (this.get(3) === 0) {
                        return 12;
                    }
                    if (this.get(3) < 13) {
                        return this.get(3);
                    }
                    return this.get(3) - 12;
                },
                iso: function() {
                    var arr = [ 0, 0, 0 ], i = 0;
                    for (i = 0; i < 3; i++) {
                        arr[i] = this.get(i);
                        if (i === 1) {
                            arr[i]++;
                        }
                        if (arr[i] < 10) {
                            arr[i] = "0" + String(arr[i]);
                        }
                    }
                    return arr.join("-");
                },
                comp: function() {
                    return parseInt(this.iso().replace(/-/g, ""), 10);
                },
                getEpoch: function() {
                    return Math.floor(this.getTime() / 1e3);
                },
                getArray: function() {
                    var arr = [ 0, 0, 0, 0, 0, 0 ], i = 0;
                    for (i = 0; i < 6; i++) {
                        arr[i] = this.get(i);
                    }
                    return arr;
                },
                setFirstDay: function(day) {
                    this.setD(2, 1).adj(2, day - this.getDay());
                    if (this.get(2) > 10) {
                        this.adj(2, 7);
                    }
                    return this;
                },
                setDWeek: function(type, num) {
                    if (type === 4) {
                        return this.setD(1, 0).setD(2, 1).setFirstDay(4).adj(2, -3).adj(2, (num - 1) * 7);
                    }
                    return this.setD(1, 0).setD(2, 1).setFirstDay(type).adj(2, (num - 1) * 7);
                },
                getDWeek: function(type) {
                    var t1, t2;
                    switch (type) {
                      case 0:
                        t1 = this.copy([ 0, -1 * this.getMonth() ]).setFirstDay(0);
                        return Math.floor((this.getTime() - (t1.getTime() + (this.getTimezoneOffset() - t1.getTimezoneOffset()) * 6e4)) / 6048e5) + 1;

                      case 1:
                        t1 = this.copy([ 0, -1 * this.getMonth() ]).setFirstDay(1);
                        return Math.floor((this.getTime() - (t1.getTime() + (this.getTimezoneOffset() - t1.getTimezoneOffset()) * 6e4)) / 6048e5) + 1;

                      case 4:
                        if (this.getMonth() === 11 && this.getDate() > 28) {
                            return 1;
                        }
                        t1 = this.copy([ 0, -1 * this.getMonth() ], true).setFirstDay(4).adj(2, -3);
                        t2 = Math.floor((this.getTime() - (t1.getTime() + (this.getTimezoneOffset() - t1.getTimezoneOffset()) * 6e4)) / 6048e5) + 1;
                        if (t2 < 1) {
                            t1 = this.copy([ -1, -1 * this.getMonth() ]).setFirstDay(4).adj(2, -3);
                            return Math.floor((this.getTime() - t1.getTime()) / 6048e5) + 1;
                        }
                        return t2;

                      default:
                        return 0;
                    }
                }
            });
        },
        _ord: {
            "default": function(num) {
                var ending = num % 10;
                if (num > 9 && num < 21 || ending > 3) {
                    return "th";
                }
                return [ "th", "st", "nd", "rd" ][ending];
            }
        },
        _customformat: {
            "default": function() {
                return false;
            }
        },
        _formatter: function(format, date, allowArIn) {
            var w = this, o = this.options, tmp, dur = 0;
            if (typeof allowArIn === "undefined") {
                allowArIn = true;
            }
            if (o.mode.substr(0, 4) === "dura") {
                dur = w._dur(this.theDate.getTime() - this.initDate.getTime());
                if (!format.match(/%Dd/)) {
                    dur[1] += dur[0] * 24;
                }
                if (!format.match(/%Dl/)) {
                    dur[2] += dur[1] * 60;
                }
                if (!format.match(/%DM/)) {
                    dur[3] += dur[2] * 60;
                }
            }
            format = format.replace(/%(D|X|0|-)*([1-9a-zA-Z])/g, function(match, pad, oper) {
                if (pad === "X") {
                    if (typeof w._customformat[o.mode] !== "undefined") {
                        return w._customformat[o.mode](oper, date, o);
                    }
                    return match;
                }
                if (pad === "D") {
                    switch (oper) {
                      case "d":
                        return dur[0];

                      case "l":
                        return w._zPad(dur[1]);

                      case "M":
                        return w._zPad(dur[2]);

                      case "S":
                        return w._zPad(dur[3]);

                      case "A":
                        return w.__("durationDays")[dur[0] === 1 ? 0 : 1];

                      default:
                        return match;
                    }
                }
                switch (oper) {
                  case "a":
                    return w.__("daysOfWeekShort")[date.getDay()];

                  case "A":
                    return w.__("daysOfWeek")[date.getDay()];

                  case "b":
                    return w.__("monthsOfYearShort")[date.getMonth()];

                  case "B":
                    return w.__("monthsOfYear")[date.getMonth()];

                  case "C":
                    return parseInt(date.getFullYear() / 100);

                  case "d":
                    return w._zPad(date.getDate(), pad);

                  case "H":
                  case "k":
                    return w._zPad(date.getHours(), pad);

                  case "I":
                  case "l":
                    return w._zPad(date.get12hr(), pad);

                  case "m":
                    return w._zPad(date.getMonth() + 1, pad);

                  case "M":
                    return w._zPad(date.getMinutes(), pad);

                  case "p":
                  case "P":
                    tmp = w.__("meridiem")[date.get(3) < 12 ? 0 : 1].toUpperCase();
                    return oper === "P" ? tmp.toLowerCase() : tmp;

                  case "s":
                    return date.getEpoch();

                  case "S":
                    return w._zPad(date.getSeconds(), pad);

                  case "u":
                    return w._zPad(date.getDay() + 1, pad);

                  case "w":
                    return date.getDay();

                  case "y":
                    return w._zPad(date.getFullYear() % 100);

                  case "Y":
                    return date.getFullYear();

                  case "E":
                    return date.getFullYear() + 543;

                  case "V":
                    return w._zPad(date.getDWeek(4), pad);

                  case "U":
                    return w._zPad(date.getDWeek(0), pad);

                  case "W":
                    return w._zPad(date.getDWeek(1), pad);

                  case "o":
                    if (typeof w._ord[o.useLang] !== "undefined") {
                        return w._ord[o.useLang](date.getDate());
                    }
                    return w._ord["default"](date.getDate());

                  case "j":
                    tmp = new Date(date.getFullYear(), 0, 1);
                    tmp = "000" + String(Math.ceil((date - tmp) / 864e5) + 1);
                    return tmp.slice(-3);

                  case "J":
                    return date.toJSON();

                  case "G":
                    tmp = date.getFullYear();
                    if (date.getDWeek(4) === 1 && date.getMonth() > 0) {
                        return tmp + 1;
                    }
                    if (date.getDWeek(4) > 51 && date.getMonth() < 11) {
                        return tmp - 1;
                    }
                    return tmp;

                  case "g":
                    tmp = date.getFullYear % 100;
                    if (date.getDWeek(4) === 1 && date.getMonth() > 0) {
                        ++tmp;
                    }
                    if (date.getDWeek(4) > 51 && date.getMonth() < 11) {
                        --tmp;
                    }
                    return w._zpad(tmp);

                  default:
                    return match;
                }
            });
            if (w.__("useArabicIndic") === true && allowArIn === true) {
                format = w._dRep(format);
            }
            return format;
        },
        _minStepFix: function() {
            var newMinute = this.theDate.get(4), mstep = this.options.minuteStep, roundDirection = this.options.minStepRound, remainder = newMinute % mstep;
            if (mstep > 1 && remainder > 0) {
                if (roundDirection < 0) {
                    newMinute = newMinute - remainder;
                } else if (roundDirection > 0) {
                    newMinute = newMinute + (mstep - remainder);
                } else {
                    if (newMinute % mstep < mstep / 2) {
                        newMinute = newMinute - remainder;
                    } else {
                        newMinute = newMinute + (mstep - remainder);
                    }
                }
                this.theDate.setMinutes(newMinute);
            }
        },
        _check: function() {
            var td, year, month, date, i, tihm, w = this, o = this.options, now = this.theDate;
            w.dateOK = true;
            if (typeof o.mode === "undefined") {
                return true;
            }
            if (o.afterToday) {
                td = new w._date();
                if (now < td) {
                    now = td;
                }
            }
            if (o.beforeToday) {
                td = new w._date();
                if (now > td) {
                    now = td;
                }
            }
            if (o.maxDays !== false) {
                td = new w._date();
                td.adj(2, o.maxDays);
                if (now > td) {
                    now = td;
                }
            }
            if (o.minDays !== false) {
                td = new w._date();
                td.adj(2, -1 * o.minDays);
                if (now < td) {
                    now = td;
                }
            }
            if (o.minHour !== false) {
                if (now.get(3) < o.minHour) {
                    now.setD(3, o.minHour);
                }
            }
            if (o.maxHour !== false) {
                if (now.get(3) > o.maxHour) {
                    now.setD(3, o.maxHour);
                }
            }
            if (o.minTime !== false) {
                td = new w._date();
                tihm = o.minTime.split(":");
                td.setD(3, tihm[0]).setD(4, tihm[1]);
                if (now < td) {
                    now = td;
                }
            }
            if (o.maxTime !== false) {
                td = new w._date();
                tihm = o.maxTime.split(":");
                td.setD(3, tihm[0]).setD(4, tihm[1]);
                if (now > td) {
                    now = td;
                }
            }
            if (o.maxYear !== false) {
                td = new w._date(o.maxYear, 11, 31);
                if (now > td) {
                    now = td;
                }
            }
            if (o.minYear !== false) {
                td = new w._date(o.minYear, 0, 1);
                if (now < td) {
                    now = td;
                }
            }
            if (o.mode.substr(0, 4) === "time" || o.mode.substr(0, 3) === "dur") {
                if (o.mode === "timeflipbox" && o.validHours !== false) {
                    if ($.inArray(now.get(3), o.validHours) < 0) {
                        w.dateOK = false;
                    }
                }
            } else {
                if (o.blackDatesRec !== false) {
                    year = now.get(0);
                    month = now.get(1);
                    date = now.get(2);
                    for (i = 0; i < o.blackDatesRec.length; i++) {
                        if ((o.blackDatesRec[i][0] === -1 || o.blackDatesRec[i][0] === year) && (o.blackDatesRec[i][1] === -1 || o.blackDatesRec[i][1] === month) && (o.blackDatesRec[i][2] === -1 || o.blackDatesRec[i][2] === date)) {
                            w.dateOK = false;
                        }
                    }
                }
                if (o.blackDates !== false) {
                    if ($.inArray(now.iso(), o.blackDates) > -1) {
                        w.dateOK = false;
                    }
                }
                if (o.blackDays !== false) {
                    if ($.inArray(now.getDay(), o.blackDays) > -1) {
                        w.dateOK = false;
                    }
                }
                if (o.whiteDates !== false) {
                    if ($.inArray(w.theDate.iso(), o.whiteDates) > -1) {
                        w.dateOK = true;
                        now = w.theDate;
                    }
                }
            }
            w.theDate = now;
        },
        _fixstepper: function(order) {
            var step = this.options.durationSteppers, actual = this.options.durationStep;
            if ($.inArray("d", order) > -1) {
                step.d = actual;
            }
            if ($.inArray("h", order) > -1) {
                step.d = 1;
                step.h = actual;
            }
            if ($.inArray("i", order) > -1) {
                step.h = 1;
                step.i = actual;
            }
            if ($.inArray("s", order) > -1) {
                step.i = 1;
                step.s = actual;
            }
        },
        _parser: {
            "default": function() {
                return false;
            }
        },
        _makeDate: function(str) {
            var i, exp_temp, exp_format, grbg, w = this, o = this.options, defVal = this.options.defaultValue, adv = w.__fmt(), exp_input = null, exp_names = [], date = new w._date(), d = {
                year: -1,
                mont: -1,
                date: -1,
                hour: -1,
                mins: -1,
                secs: -1,
                week: false,
                wtyp: 4,
                wday: false,
                yday: false,
                meri: 0
            };
            str = $.trim(w.__("useArabicIndic") === true && typeof str !== "undefined" ? w._dRep(str, -1) : str);
            if (typeof o.mode === "undefined") {
                return date;
            }
            if (typeof w._parser[o.mode] !== "undefined") {
                return w._parser[o.mode].apply(w, [ str ]);
            }
            if (o.mode === "durationbox" || o.mode === "durationflipbox") {
                adv = adv.replace(/%D([a-z])/gi, function(match, oper) {
                    switch (oper) {
                      case "d":
                      case "l":
                      case "M":
                      case "S":
                        return "(" + match + "|[0-9]+)";

                      default:
                        return ".+?";
                    }
                });
                adv = new RegExp("^" + adv + "$");
                exp_input = adv.exec(str);
                exp_format = adv.exec(w.__fmt());
                if (exp_input === null || exp_input.length !== exp_format.length) {
                    if (typeof defVal === "number" && defVal > 0) {
                        return new w._date((w.initDate.getEpoch() + parseInt(defVal, 10)) * 1e3);
                    }
                    return new w._date(w.initDate.getTime());
                }
                exp_temp = w.initDate.getEpoch();
                for (i = 1; i < exp_input.length; i++) {
                    grbg = parseInt(exp_input[i], 10);
                    if (exp_format[i].match(/^%Dd$/i)) {
                        exp_temp = exp_temp + grbg * 86400;
                    }
                    if (exp_format[i].match(/^%Dl$/i)) {
                        exp_temp = exp_temp + grbg * 3600;
                    }
                    if (exp_format[i].match(/^%DM$/i)) {
                        exp_temp = exp_temp + grbg * 60;
                    }
                    if (exp_format[i].match(/^%DS$/i)) {
                        exp_temp = exp_temp + grbg;
                    }
                }
                return new w._date(exp_temp * 1e3);
            }
            if (adv === "%J") {
                date = new w._date(str);
                if (isNaN(date.getDate())) {
                    date = new w._date();
                }
                return date;
            }
            adv = adv.replace(/%(0|-)*([a-z])/gi, function(match, pad, oper) {
                exp_names.push(oper);
                switch (oper) {
                  case "p":
                  case "P":
                  case "b":
                  case "B":
                    return "(" + match + "|.+?)";

                  case "H":
                  case "k":
                  case "I":
                  case "l":
                  case "m":
                  case "M":
                  case "S":
                  case "V":
                  case "U":
                  case "u":
                  case "W":
                  case "d":
                    return "(" + match + "|[0-9]{" + (pad === "-" ? "1," : "") + "2})";

                  case "j":
                    return "(" + match + "|[0-9]{3})";

                  case "s":
                    return "(" + match + "|[0-9]+)";

                  case "g":
                  case "y":
                    return "(" + match + "|[0-9]{2})";

                  case "E":
                  case "G":
                  case "Y":
                    return "(" + match + "|[0-9]{1,4})";

                  default:
                    exp_names.pop();
                    return ".+?";
                }
            });
            adv = new RegExp("^" + adv + "$");
            exp_input = adv.exec(str);
            exp_format = adv.exec(w.__fmt());
            if (exp_input === null || exp_input.length !== exp_format.length) {
                if (defVal !== false && defVal !== "") {
                    switch (typeof defVal) {
                      case "object":
                        if ($.isFunction(defVal.getDay)) {
                            date = defVal;
                        } else {
                            if (defVal.length === 3) {
                                date = w._pa(defVal, o.mode.substr(0, 4) === "time" ? date : false);
                            }
                        }
                        break;

                      case "number":
                        date = new w._date(defVal * 1e3);
                        break;

                      case "string":
                        if (o.mode.substr(0, 4) === "time") {
                            exp_temp = $.extend([ 0, 0, 0 ], defVal.split(":")).slice(0, 3);
                            date = w._pa(exp_temp, date);
                        } else {
                            exp_temp = $.extend([ 0, 0, 0 ], defVal.split("-")).slice(0, 3);
                            exp_temp[1]--;
                            date = w._pa(exp_temp, false);
                        }
                        break;
                    }
                }
                if (isNaN(date.getDate())) {
                    date = new w._date();
                }
            } else {
                for (i = 1; i < exp_input.length; i++) {
                    grbg = parseInt(exp_input[i], 10);
                    switch (exp_names[i - 1]) {
                      case "s":
                        return new w._date(parseInt(exp_input[i], 10) * 1e3);

                      case "Y":
                      case "G":
                        d.year = grbg;
                        break;

                      case "E":
                        d.year = grbg - 543;
                        break;

                      case "y":
                      case "g":
                        if (o.afterToday || grbg < 38) {
                            d.year = 2e3 + grbg;
                        } else {
                            d.year = 1900 + grbg;
                        }
                        break;

                      case "m":
                        d.mont = grbg - 1;
                        break;

                      case "d":
                        d.date = grbg;
                        break;

                      case "H":
                      case "k":
                      case "I":
                      case "l":
                        d.hour = grbg;
                        break;

                      case "M":
                        d.mins = grbg;
                        break;

                      case "S":
                        d.secs = grbg;
                        break;

                      case "u":
                        d.wday = grbg - 1;
                        break;

                      case "w":
                        d.wday = grbg;
                        break;

                      case "j":
                        d.yday = grbg;
                        break;

                      case "V":
                        d.week = grbg;
                        d.wtyp = 4;
                        break;

                      case "U":
                        d.week = grbg;
                        d.wtyp = 0;
                        break;

                      case "W":
                        d.week = grbg;
                        d.wtyp = 1;
                        break;

                      case "p":
                      case "P":
                        grbg = new RegExp("^" + exp_input[i] + "$", "i");
                        d.meri = grbg.test(w.__("meridiem")[0]) ? -1 : 1;
                        break;

                      case "b":
                        exp_temp = $.inArray(exp_input[i], w.__("monthsOfYearShort"));
                        if (exp_temp > -1) {
                            d.mont = exp_temp;
                        }
                        break;

                      case "B":
                        exp_temp = $.inArray(exp_input[i], w.__("monthsOfYear"));
                        if (exp_temp > -1) {
                            d.mont = exp_temp;
                        }
                        break;
                    }
                }
                if (d.meri !== 0) {
                    if (d.meri === -1 && d.hour === 12) {
                        d.hour = 0;
                    }
                    if (d.meri === 1 && d.hour !== 12) {
                        d.hour = d.hour + 12;
                    }
                }
                date = new w._date(w._n(d.year, 0), w._n(d.mont, 0), w._n(d.date, 1), w._n(d.hour, 0), w._n(d.mins, 0), w._n(d.secs, 0), 0);
                if (d.year < 100 && d.year !== -1) {
                    date.setFullYear(d.year);
                }
                if (d.mont > -1 && d.date > -1 || d.hour > -1 && d.mins > -1 && d.secs > -1) {
                    return date;
                }
                if (d.week !== false) {
                    date.setDWeek(d.wtyp, d.week);
                    if (d.date > -1) {
                        date.setDate(d.date);
                    }
                }
                if (d.yday !== false) {
                    date.setD(1, 0).setD(2, 1).adj(2, d.yday - 1);
                }
                if (d.wday !== false) {
                    date.adj(2, d.wday - date.getDay());
                }
            }
            return date;
        },
        _event: function(e, p) {
            var tmp, w = $(this).data("jtsage-datebox"), o = $(this).data("jtsage-datebox").options;
            if (!e.isPropagationStopped()) {
                switch (p.method) {
                  case "close":
                    if (typeof p.closeCancel === "undefined") {
                        p.closeCancel = false;
                    }
                    w.cancelClose = p.closeCancel;
                    w.close();
                    break;

                  case "open":
                    w.open();
                    break;

                  case "set":
                    if (typeof p.value === "object") {
                        w.theDate = p.value;
                        w._t({
                            method: "doset"
                        });
                    } else {
                        $(this).val(p.value);
                        if (o.linkedField !== false) {
                            $(o.linkedField).val(w.callFormat(o.linkedFieldFormat, w.theDate, false));
                        }
                        $(this).trigger("change");
                    }
                    break;

                  case "doset":
                    tmp = "_" + w.options.mode + "DoSet";
                    if ($.isFunction(w[tmp])) {
                        w[tmp].apply(w, []);
                    } else {
                        w._t({
                            method: "set",
                            value: w._formatter(w.__fmt(), w.theDate),
                            date: w.theDate
                        });
                    }
                    break;

                  case "dooffset":
                    if (p.type) {
                        w._offset(p.type, p.amount, true);
                    }
                    break;

                  case "dorefresh":
                    w.refresh();
                    break;

                  case "doclear":
                    $(this).val("").trigger("change");
                    break;

                  case "clear":
                    $(this).trigger("change");
                    break;
                }
            }
        },
        _build: {
            "default": function() {
                this.d.headerText = "Error";
                if (this.d.intHTML !== false) {
                    this.d.intHTML.remove().empty();
                }
                this.d.intHTML = $("<div class='ui-body-b'><h2 style='text-align:center'" + " class='bg-danger'>Unknown Mode</h2></div>");
            },
            calbox: function() {
                var tempVal, calContent, genny, weekdayControl, row, col, rows, cols, htmlRow, i, fmtRet, fmtObj, absStartDO, absEndDO, w = this, o = this.options, dList = o.calDateList, uid = "ui-datebox-", curDate = w.calBackDate !== false && w.theDate.get(0) === w.calBackDate.get(0) && w.theDate.get(1) === w.calBackDate.get(1) ? new w._date(w.calBackDate.getTime()) : w.theDate, checked = false, checkDatesObj = {}, minDate = w.initDate.copy(), maxDate = w.initDate.copy(), cStartDay = (curDate.copy([ 0 ], [ 0, 0, 1 ]).getDay() - w.__("calStartDay") + 7) % 7, curMonth = curDate.get(1), curYear = curDate.get(0), curDateArr = curDate.getArray(), presetDate = w.d.input.val() === "" ? w._startOffset(w._makeDate(w.d.input.val())) : w._makeDate(w.d.input.val()), presetDay = -1, cTodayDate = new w._date(), cTodayDateArr = cTodayDate.getArray(), weekNum = curDate.copy([ 0 ], [ 0, 0, 1 ]).adj(2, -1 * cStartDay + (w.__("calStartDay") === 0 ? 1 : 0)).getDWeek(4), weekModeSel = 0, isTrueMonth = false, isTrueYear = false, cMonthEnd = 32 - w.theDate.copy([ 0 ], [ 0, 0, 32, 13 ]).getDate(), cPrevMonthEnd = 32 - w.theDate.copy([ 0, -1 ], [ 0, 0, 32, 13 ]).getDate(), checkDates = o.afterToday || o.beforeToday || o.notToday || o.calAlwaysValidateDates || o.maxDays || o.minDays || o.blackDays || o.blackDates ? true : false;
                if (w.calBackDate !== false) {
                    if (w.theDate.get(0) === w.calBackDate.get(0) && w.theDate.get(1) === w.calBackDate.get(1)) {
                        w.theDate = new w._date(w.calBackDate.getTime());
                        w.calBackDate = false;
                    }
                }
                if (typeof w.d.intHTML !== "boolean") {
                    w.d.intHTML.remove();
                    w.d.intHTML = null;
                }
                w.d.headerText = w._grabLabel() !== false ? w._grabLabel() : w.__("titleDateDialogLabel");
                w.d.intHTML = $("<span>");
                $(w._spf("<div class='{cl1}'><div class='{cl2}'><h4 style='margin: 6px 0 0 0;'>{content}</h4></div></div>", {
                    cl1: uid + "gridheader",
                    cl2: uid + "gridlabel",
                    content: w._formatter(w.__("calHeaderFormat"), w.theDate)
                })).appendTo(w.d.intHTML);
                w._cal_prev_next(w.d.intHTML.find("." + uid + "gridheader"));
                if (o.calNoHeader) {
                    if (o.calUsePickersIcons) {
                        w.d.intHTML.find("." + uid + "gridlabel").hide();
                        w.d.intHTML.find("." + uid + "gridplus").find(".ui-btn-inline").addClass(uid + "nomargbtn");
                        w.d.intHTML.find("." + uid + "gridminus").find(".ui-btn-inline").addClass(uid + "nomargbtn");
                    } else {
                        w.d.intHTML.find("." + uid + "gridheader").remove();
                    }
                }
                w.calNext = true;
                w.calPrev = true;
                if (Math.floor(cTodayDate.comp() / 100) === Math.floor(curDate.comp() / 100)) {
                    isTrueMonth = true;
                }
                if (Math.floor(cTodayDate.comp() / 1e4) === Math.floor(curDate.comp() / 1e4)) {
                    isTrueYear = true;
                }
                if (presetDate.comp() === curDate.comp()) {
                    presetDay = presetDate.get(2);
                }
                if (o.afterToday && (isTrueMonth || isTrueYear && cTodayDateArr[1] >= curDateArr[1])) {
                    w.calPrev = false;
                }
                if (o.beforeToday && (isTrueMonth || isTrueYear && cTodayDateArr[1] <= curDateArr[1])) {
                    w.calNext = false;
                }
                if (o.minDays !== false) {
                    minDate.adj(2, o.minDays * -1);
                    tempVal = minDate.getArray();
                    if (curDateArr[0] === tempVal[0] && curDateArr[1] <= tempVal[1]) {
                        w.calPrev = false;
                    }
                }
                if (o.maxDays !== false) {
                    maxDate.adj(2, o.maxDays);
                    tempVal = maxDate.getArray();
                    if (curDateArr[0] === tempVal[0] && curDateArr[1] >= tempVal[1]) {
                        w.calNext = false;
                    }
                }
                if (o.calUsePickers) {
                    w._cal_pickers(curMonth, curYear, cTodayDateArr);
                }
                calContent = $("<div class='" + uid + "grid'>").appendTo(w.d.intHTML);
                if (o.calShowDays) {
                    w._cal_days = w.__("daysOfWeekShort").concat(w.__("daysOfWeekShort"));
                    weekdayControl = $("<div>", {
                        "class": uid + "gridrow"
                    }).appendTo(calContent);
                    if (o.calControlGroup) {
                        weekdayControl.addClass(uid + "gridrow-last");
                    }
                    if (w.__("isRTL") === true) {
                        weekdayControl.css("direction", "rtl");
                    }
                    if (o.calShowWeek) {
                        $("<div>").addClass(uid + "griddate " + uid + "griddate-label").appendTo(weekdayControl);
                    }
                    for (i = 0; i <= 6; i++) {
                        $("<div>").text(w._cal_days[(i + w.__("calStartDay")) % 7]).addClass(uid + "griddate " + uid + "griddate-label").appendTo(weekdayControl);
                    }
                }
                checkDatesObj = {
                    i: minDate,
                    x: maxDate,
                    t: cTodayDate,
                    p: presetDay
                };
                genny = w._cal_gen(cStartDay, cPrevMonthEnd, cMonthEnd, !o.calOnlyMonth, curDate.get(1));
                if (!$.isFunction(o.calFormatter) && o.calFormatter !== false && $.isFunction(window[o.calFormatter])) {
                    o.calFormatter = window[o.calFormatter];
                }
                if (!$.isFunction(o.calBeforeAppendFunc) && o.calBeforeAppendFunc !== false && $.isFunction(window[o.calBeforeAppendFunc])) {
                    o.calBeforeAppendFunc = window[o.calBeforeAppendFunc];
                }
                absStartDO = new Date(w.theDate.get(0), genny[0][0][1], genny[0][0][0], 0, 0, 0, 0);
                absEndDO = new Date(w.theDate.get(0), genny[genny.length - 1][6][1], genny[genny.length - 1][6][0], 0, 0, 0, 0);
                if (w.calBackDate === false) {
                    w.calDateVisible = true;
                } else {
                    if (o.calOnlyMonth) {
                        w.calDateVisible = false;
                    } else {
                        if (w.calBackDate.comp() < absStartDO.comp() || w.calBackDate.comp() > absEndDO.comp()) {
                            w.calDateVisible = false;
                        } else {
                            w.calDateVisible = true;
                        }
                    }
                }
                for (row = 0, rows = genny.length; row < rows; row++) {
                    htmlRow = $("<div>", {
                        "class": uid + "gridrow"
                    });
                    if (w.__("isRTL")) {
                        htmlRow.css("direction", "rtl");
                    }
                    if (o.calShowWeek) {
                        $("<div>", {
                            "class": uid + "griddate " + uid + "griddate-empty"
                        }).text("W" + weekNum).addClass(w.baseMode === "bootstrap" ? "pull-left" : "").css(o.calControlGroup ? {
                            "float": "left"
                        } : {}).appendTo(htmlRow);
                        weekNum++;
                        if (weekNum > 52 && typeof genny[row + 1] !== "undefined") {
                            weekNum = new w._date(curDateArr[0], curDateArr[1], w.__("calStartDay") === 0 ? genny[row + 1][1][0] : genny[row + 1][0][0], 0, 0, 0, 0).getDWeek(4);
                        }
                    }
                    for (col = 0, cols = genny[row].length; col < cols; col++) {
                        if (o.calWeekMode) {
                            weekModeSel = genny[row][o.calWeekModeDay][0];
                        }
                        if (typeof genny[row][col] === "boolean") {
                            $("<div>", {
                                "class": uid + "griddate " + uid + "griddate-empty"
                            }).appendTo(htmlRow);
                        } else {
                            checked = w._cal_check(checkDates, curDateArr[0], genny[row][col][1], genny[row][col][0], checkDatesObj);
                            if (genny[row][col][0]) {
                                if (!$.isFunction(o.calFormatter)) {
                                    fmtRet = {
                                        text: genny[row][col][0],
                                        "class": ""
                                    };
                                } else {
                                    fmtObj = {
                                        Year: genny[row][col][1] > 11 ? curYear + 1 : genny[row][col][1] < 0 ? curYear - 1 : curYear,
                                        Month: genny[row][col][1] === 12 ? 0 : genny[row][col][1] === -1 ? 11 : genny[row][col][1],
                                        Date: genny[row][col][0]
                                    };
                                    fmtObj.Arr = [ fmtObj.Year, w._zPad(fmtObj.Month + 1), w._zPad(fmtObj.Date) ];
                                    fmtObj.ISO = fmtObj.Arr.join("-");
                                    fmtObj.Comp = fmtObj.Arr.join("");
                                    fmtObj.curMonth = curDate.get(1);
                                    fmtObj.curYear = curYear;
                                    fmtObj.dateVisible = w.calDateVisible;
                                    tempVal = o.calFormatter(fmtObj);
                                    if (typeof tempVal !== "object") {
                                        fmtRet = {
                                            text: tempVal,
                                            "class": ""
                                        };
                                    } else {
                                        fmtRet = {
                                            text: tempVal.text,
                                            "class": tempVal["class"]
                                        };
                                    }
                                }
                                o.calBeforeAppendFunc($("<div>").html(fmtRet.text).addClass(uid + "griddate").addClass("" + (curMonth === genny[row][col][1] || checked.force ? !checked.ok && w.baseMode === "jqm" ? o.btnCls + " " + checked.theme : o.btnCls + checked.theme : uid + "griddate-empty" + (w.baseMode === "bootstrap" ? o.btnCls + "default" : "") + (o.calOnlyMonth === true ? " " + o.disabledState : ""))).addClass(fmtRet["class"]).css(curMonth !== genny[row][col][1] && !o.calOnlyMonth ? {
                                    cursor: "pointer"
                                } : {}).data("date", o.calWeekMode ? weekModeSel : genny[row][col][0]).data("enabled", checked.ok).data("month", genny[row][o.calWeekMode ? o.calWeekModeDay : col][1])).appendTo(htmlRow);
                            }
                        }
                    }
                    switch (w.baseMode) {
                      case "jqm":
                        if (o.calControlGroup) {
                            htmlRow.find("." + uid + "griddate-empty").addClass("ui-btn");
                            if (o.calOnlyMonth) {
                                htmlRow.find("." + uid + "griddate-empty").addClass("ui-state-disabled");
                            }
                            htmlRow.controlgroup({
                                type: "horizontal"
                            });
                        }
                        break;

                      case "bootstrap":
                        htmlRow.addClass("btn-group");
                        break;

                      case "jqueryui":
                        htmlRow.find("." + uid + "griddate").removeClass("ui-corner-all").not("." + uid + "griddate-empty").first().addClass("ui-corner-left").end().last().addClass("ui-corner-right");
                        break;
                    }
                    if (row === rows - 1) {
                        htmlRow.addClass(uid + "gridrow-last");
                    }
                    htmlRow.appendTo(calContent);
                }
                if (o.calShowWeek) {
                    calContent.find("." + uid + "griddate").addClass(uid + "griddate-week");
                }
                if (o.calShowDateList && dList !== false) {
                    w._cal_date_list(calContent);
                }
                if (o.useTodayButton || o.useTomorrowButton || o.useClearButton || o.useCancelButton) {
                    htmlRow = $("<div>", {
                        "class": uid + "controls"
                    });
                    if (o.useTodayButton) {
                        htmlRow.append(w._stdBtn.today.apply(w));
                    }
                    if (o.useTomorrowButton) {
                        htmlRow.append(w._stdBtn.tomorrow.apply(w));
                    }
                    if (o.useClearButton) {
                        htmlRow.append(w._stdBtn.clear.apply(w));
                    }
                    if (o.useCancelButton) {
                        htmlRow.append(w._stdBtn.cancel.apply(w));
                    }
                    w._controlGroup(htmlRow).appendTo(calContent);
                }
                w.d.intHTML.on(o.clickEventAlt, "div." + uid + "griddate", function(e) {
                    e.preventDefault();
                    if ($(this).data("enabled")) {
                        w.calBackDate = false;
                        w.theDate.setD(2, 1).setD(1, $(this).data("month")).setD(2, $(this).data("date"));
                        w._t({
                            method: "set",
                            value: w._formatter(w.__fmt(), w.theDate),
                            date: w.theDate
                        });
                        w._t({
                            method: "close"
                        });
                    }
                });
                w.d.intHTML.on("swipeleft", function() {
                    if (w.calNext) {
                        if (w.calBackDate === false) {
                            w.calBackDate = new Date(w.theDate.getTime());
                        }
                        w._offset("m", 1);
                    }
                }).on("swiperight", function() {
                    if (w.calPrev) {
                        if (w.calBackDate === false) {
                            w.calBackDate = new Date(w.theDate.getTime());
                        }
                        w._offset("m", -1);
                    }
                });
                if (w.wheelExists) {
                    w.d.intHTML.on("mousewheel", function(e, d) {
                        e.preventDefault();
                        if (d > 0 && w.calNext) {
                            if (w.calBackDate === false) {
                                w.calBackDate = new Date(w.theDate.getTime());
                            }
                            w.theDate.setD(2, 1);
                            w._offset("m", 1);
                        }
                        if (d < 0 && w.calPrev) {
                            if (w.calBackDate === false) {
                                w.calBackDate = new Date(w.theDate.getTime());
                            }
                            w.theDate.setD(2, 1);
                            w._offset("m", -1);
                        }
                    });
                }
            },
            timebox: function() {
                this._build.datebox.apply(this, []);
            },
            durationbox: function() {
                this._build.datebox.apply(this, []);
            },
            datebox: function() {
                var offAmount, i, tmp, allControls, currentControl, controlButtons, w = this, g = this.drag, o = this.options, dur = o.mode === "durationbox" ? true : false, cnt = 0, defDurOrder = [ "d", "h", "i", "s" ], uid = "ui-datebox-";
                if (typeof w.d.intHTML !== "boolean") {
                    w.d.intHTML.empty().remove();
                }
                w.d.headerText = w._grabLabel() !== false ? w._grabLabel() : o.mode === "datebox" ? w.__("titleDateDialogLabel") : w.__("titleTimeDialogLabel");
                w.d.intHTML = $("<span>");
                w.fldOrder = o.mode === "datebox" ? w.__("dateFieldOrder") : dur ? w.__("durationOrder") : w.__("timeFieldOrder");
                if (!dur) {
                    w._check();
                    w._minStepFix();
                    w._dbox_vhour(typeof w._dbox_delta !== "undefined" ? w._dbox_delta : 1);
                } else {
                    w.dateOK = true;
                    w._fixstepper(w.fldOrder);
                }
                if (o.mode === "datebox") {
                    $(w._spf("<div class='{cls}'><h4>{text}</h4></div>", {
                        cls: uid + "header",
                        text: w._formatter(w.__("headerFormat"), w.theDate)
                    })).appendTo(w.d.intHTML);
                }
                allControls = $("<div>").addClass(uid + "datebox-groups");
                for (i = 0; i < w.fldOrder.length; i++) {
                    currentControl = $("<div>").addClass(uid + "datebox-group");
                    if (w.baseMode === "jqm") {
                        currentControl.addClass("ui-block-" + [ "a", "b", "c", "d", "e" ][cnt]);
                    }
                    if (dur) {
                        offAmount = o.durationSteppers[w.fldOrder[i]];
                    } else {
                        if (w.fldOrder[i] === "i") {
                            offAmount = o.minuteStep;
                        } else {
                            offAmount = 1;
                        }
                    }
                    if (w.fldOrder[i] !== "a" || w.__("timeFormat") === 12) {
                        w._dbox_button(1, w.fldOrder[i], offAmount).appendTo(currentControl);
                        if (dur) {
                            $(w._spf("<div><label>{text}</label></div>", {
                                text: w.__("durationLabel")[$.inArray(w.fldOrder[i], defDurOrder)]
                            })).addClass(uid + "datebox-label " + "ui-body-" + o.themeInput).appendTo(currentControl);
                        }
                        $("<div><input class='form-control w-100' type='text'></div>").addClass(function() {
                            switch (w.baseMode) {
                              case "jqm":
                                return "ui-input-text ui-body-" + o.themeInput + " ui-mini";

                              case "bootstrap":
                              case "bootstrap4":
                                return o.themeInput;

                              default:
                                return null;
                            }
                        }).appendTo(currentControl).find("input").data({
                            field: w.fldOrder[i],
                            amount: offAmount
                        });
                        w._dbox_button(-1, w.fldOrder[i], offAmount).appendTo(currentControl);
                        currentControl.appendTo(allControls);
                        cnt++;
                    }
                }
                switch (w.baseMode) {
                  case "jqm":
                    allControls.addClass("ui-grid-" + [ 0, 0, "a", "b", "c", "d", "e" ][cnt]);
                    break;

                  case "bootstrap":
                    allControls.addClass("row");
                    allControls.find("." + uid + "datebox-group").each(function() {
                        $(this).addClass("col-xs-" + 12 / cnt);
                    });
                    break;

                  case "bootstrap4":
                    allControls.addClass("row");
                    allControls.find("." + uid + "datebox-group").each(function() {
                        $(this).addClass("px-0 col-sm-" + 12 / cnt);
                    });
                    break;

                  case "jqueryui":
                    allControls.find("." + uid + "datebox-group").each(function() {
                        $(this).css("width", 100 / cnt + "%");
                    });
                    break;
                }
                allControls.appendTo(w.d.intHTML);
                w.d.divIn = allControls;
                w._dbox_run_update(true);
                if (o.useSetButton || o.useClearButton || o.useCancelButton || o.useTodayButton || o.useTomorrowButton) {
                    controlButtons = $("<div>", {
                        "class": uid + "controls"
                    });
                    if (o.useSetButton) {
                        w.setBut = w._stdBtn.close.apply(w, [ o.mode === "datebox" ? w.__("setDateButtonLabel") : dur ? w.__("setDurationButtonLabel") : w.__("setTimeButtonLabel") ]);
                        w.setBut.appendTo(controlButtons);
                    }
                    if (o.useTodayButton) {
                        controlButtons.append(w._stdBtn.today.apply(w));
                    }
                    if (o.useTomorrowButton) {
                        controlButtons.append(w._stdBtn.tomorrow.apply(w));
                    }
                    if (o.useClearButton) {
                        controlButtons.append(w._stdBtn.clear.apply(w));
                    }
                    if (o.useCancelButton) {
                        controlButtons.append(w._stdBtn.cancel.apply(w));
                    }
                    w._controlGroup(controlButtons).appendTo(w.d.intHTML);
                }
                if (!o.repButton) {
                    w.d.intHTML.on(o.clickEvent, "." + uid + "datebox-button", function(e) {
                        allControls.find(":focus").blur();
                        e.preventDefault();
                        w._dbox_delta = $(this).data("amount") > 1 ? 1 : -1;
                        w._offset($(this).data("field"), $(this).data("amount"));
                    });
                }
                allControls.on("change", "input", function() {
                    w._dbox_enter($(this));
                });
                allControls.on("keypress", "input", function(e) {
                    if (e.which === 13 && w.dateOK === true) {
                        w._dbox_enter($(this));
                        w._t({
                            method: "set",
                            value: w._formatter(w.__fmt(), w.theDate),
                            date: w.theDate
                        });
                        w._t({
                            method: "close"
                        });
                    }
                });
                if (w.wheelExists) {
                    allControls.on("mousewheel", "input", function(e, d) {
                        e.preventDefault();
                        w._dbox_delta = d < 0 ? -1 : 1;
                        w._offset($(this).data("field"), (d < 0 ? -1 : 1) * $(this).data("amount"));
                    });
                }
                if (o.repButton) {
                    w.d.intHTML.on(g.eStart, "." + uid + "datebox-button", function(e) {
                        e.preventDefault();
                        allControls.find(":focus").blur();
                        tmp = [ $(this).data("field"), $(this).data("amount") ];
                        g.move = true;
                        g.cnt = 0;
                        w._dbox_delta = $(this).data("amount") > 1 ? 1 : -1;
                        w._offset(tmp[0], tmp[1], false);
                        w._dbox_run_update();
                        if (!w.runButton) {
                            g.target = tmp;
                            w.runButton = setTimeout(function() {
                                w._dbox_run();
                            }, 500);
                        }
                    });
                    w.d.intHTML.on(g.eEndA, "." + uid + "datebox-button", function(e) {
                        if (g.move) {
                            e.preventDefault();
                            clearTimeout(w.runButton);
                            w.runButton = false;
                            g.move = false;
                        }
                    });
                }
            },
            timeflipbox: function() {
                this._build.flipbox.apply(this);
            },
            durationflipbox: function() {
                this._build.flipbox.apply(this);
            },
            flipbox: function() {
                var i, y, hRow, tmp, hRowIn, stdPos, controlButtons, w = this, o = this.options, g = this.drag, cDurS = {}, normDurPositions = [ "d", "h", "i", "s" ], dur = o.mode === "durationflipbox" ? true : false, uid = "ui-datebox-", flipBase = $("<div class='ui-overlay-shadow'><ul></ul></div>"), ctrl = $("<div>", {
                    "class": uid + "flipcontent"
                }), ti = w.theDate.getTime() - w.initDate.getTime(), themeType = "" + (w.baseMode === "jqm" ? "ui-body-" : "") + (w.baseMode === "bootstrap" || w.baseMode === "bootstrap4" ? "bg-" : ""), cDur = w._dur(ti < 0 ? 0 : ti), currentTerm, currentText;
                if (ti < 0) {
                    w.lastDuration = 0;
                    if (dur) {
                        w.theDate.setTime(w.initDate.getTime());
                    }
                } else {
                    if (dur) {
                        w.lastDuration = ti / 1e3;
                    }
                }
                if (typeof w.d.intHTML !== "boolean") {
                    w.d.intHTML.empty().remove();
                } else {
                    w.d.input.on("datebox", function(e, p) {
                        if (p.method === "postrefresh") {
                            w._fbox_pos();
                        }
                    });
                }
                w.d.headerText = w._grabLabel() !== false ? w._grabLabel() : o.mode === "flipbox" ? w.__("titleDateDialogLabel") : w.__("titleTimeDialogLabel");
                w.d.intHTML = $("<span>");
                $(document).one("popupafteropen", function() {
                    w._fbox_pos();
                });
                w.fldOrder = o.mode === "flipbox" ? w.__("dateFieldOrder") : dur ? w.__("durationOrder") : w.__("timeFieldOrder");
                if (!dur) {
                    w._check();
                    w._minStepFix();
                } else {
                    if (o.minDur !== false && w.theDate.getEpoch() - w.initDate.getEpoch() < o.minDur) {
                        w.theDate = new Date(w.initDate.getTime() + o.minDur * 1e3);
                        w.lastDuration = o.minDur;
                        cDur = w._dur(o.minDur * 1e3);
                    }
                    if (o.maxDur !== false && w.theDate.getEpoch() - w.initDate.getEpoch() > o.maxDur) {
                        w.theDate = new Date(w.initDate.getTime() + o.maxDur * 1e3);
                        w.lastDuration = o.maxDur;
                        cDur = w._dur(o.maxDur * 1e3);
                    }
                }
                if (o.mode === "flipbox") {
                    $(w._spf("<div class='{cls}'><h4>{text}</h4></div>", {
                        cls: uid + "header",
                        text: w._formatter(w.__("headerFormat"), w.theDate)
                    })).appendTo(w.d.intHTML);
                }
                if (dur) {
                    w._fixstepper(w.fldOrder);
                    tmp = $(w._spf("<div class='{cls}'></div>", {
                        cls: uid + "header" + " ui-grid-" + [ "a", "b", "c", "d", "e" ][w.fldOrder.length - 2] + " row"
                    }));
                    for (y = 0; y < w.fldOrder.length; y++) {
                        $(w._spf("<div class='{cls}'>{text}</div>", {
                            text: w.__("durationLabel")[$.inArray(w.fldOrder[y], normDurPositions)],
                            cls: uid + "fliplab" + " ui-block-" + [ "a", "b", "c", "d", "e" ][y] + " col-xs-" + 12 / w.fldOrder.length
                        })).appendTo(tmp);
                    }
                    tmp.appendTo(w.d.intHTML);
                    w.dateOK = true;
                    cDurS.d = w._fbox_series(cDur[0], 64, "d", false);
                    cDurS.h = w._fbox_series(cDur[1], 64, "h", cDur[0] > 0);
                    cDurS.i = w._fbox_series(cDur[2], 60, "i", cDur[0] > 0 || cDur[1] > 0);
                    cDurS.s = w._fbox_series(cDur[3], 60, "s", cDur[0] > 0 || cDur[1] > 0 || cDur[2] > 0);
                    ctrl.addClass(uid + "flipcontentd");
                    for (y = 0; y < w.fldOrder.length; y++) {
                        stdPos = w.fldOrder[y];
                        currentTerm = cDur[$.inArray(stdPos, normDurPositions)];
                        hRow = flipBase.clone().data({
                            field: stdPos,
                            amount: o.durationSteppers[stdPos]
                        });
                        hRowIn = hRow.find("ul");
                        for (i in cDurS[stdPos]) {
                            $(w._spf("<li class='{cls}'><span>{text}</span></li>", {
                                text: cDurS[stdPos][i][0],
                                cls: themeType + (cDurS[stdPos][i][1] !== currentTerm ? o.themeDate : o.themeDatePick)
                            })).appendTo(hRowIn);
                        }
                        hRow.appendTo(ctrl);
                    }
                } else {
                    if (w.fldOrder.length === 4) {
                        ctrl.addClass(uid + "flipcontentd");
                    }
                }
                for (y = 0; y < w.fldOrder.length && !dur; y++) {
                    currentTerm = w.fldOrder[y];
                    hRow = flipBase.clone().data({
                        field: currentTerm,
                        amount: currentTerm === "i" ? o.minuteStep : 1
                    });
                    hRowIn = hRow.find("ul");
                    if (typeof w._fbox_mktxt[currentTerm] === "function") {
                        for (i = -1 * o.flen[currentTerm]; i < o.flen[currentTerm] + 1; i++) {
                            $(w._spf("<li class='{cls}'><span>{text}</span></li>", {
                                cls: themeType + (i !== 0 ? o.themeDate : o.themeDatePick),
                                text: w._fbox_mktxt[currentTerm].apply(w, [ currentTerm === "i" ? i * o.minuteStep : i ])
                            })).appendTo(hRowIn);
                        }
                        hRow.appendTo(ctrl);
                    }
                    if (currentTerm === "a" && w.__("timeFormat") === 12) {
                        currentText = $("<li class='" + themeType + o.themeDate + "'><span></span></li>");
                        tmp = w.theDate.get(3) > 11 ? [ o.themeDate, o.themeDatePick, 2, 5 ] : [ o.themeDatePick, o.themeDate, 2, 3 ];
                        for (i = -1 * tmp[2]; i < tmp[3]; i++) {
                            if (i < 0 || i > 1) {
                                currentText.clone().appendTo(hRowIn);
                            } else {
                                $(w._spf("<li class='{cls}'><span>{text}</span></li>", {
                                    cls: themeType + tmp[i],
                                    text: w.__("meridiem")[i]
                                })).appendTo(hRowIn);
                            }
                        }
                        hRow.appendTo(ctrl);
                    }
                }
                w.d.intHTML.append(ctrl);
                $("<div>", {
                    "class": uid + "flipcenter ui-overlay-shadow"
                }).css("pointerEvents", "none").appendTo(w.d.intHTML);
                if (o.useSetButton || o.useClearButton || o.useCancelButton || o.useTodayButton || o.useTomorrowButton) {
                    controlButtons = $("<div>", {
                        "class": uid + "controls"
                    });
                    if (o.useSetButton) {
                        controlButtons.append(w._stdBtn.close.apply(w, [ o.mode === "flipbox" ? w.__("setDateButtonLabel") : dur ? w.__("setDurationButtonLabel") : w.__("setTimeButtonLabel") ]));
                    }
                    if (o.useTodayButton) {
                        controlButtons.append(w._stdBtn.today.apply(w));
                    }
                    if (o.useTomorrowButton) {
                        controlButtons.append(w._stdBtn.tomorrow.apply(w));
                    }
                    if (o.useClearButton) {
                        controlButtons.append(w._stdBtn.clear.apply(w));
                    }
                    if (o.useCancelButton) {
                        controlButtons.append(w._stdBtn.cancel.apply(w));
                    }
                    w._controlGroup(controlButtons).appendTo(w.d.intHTML);
                }
                if (w.wheelExists) {
                    w.d.intHTML.on("mousewheel", ".ui-overlay-shadow", function(e, d) {
                        e.preventDefault();
                        w._offset($(this).data("field"), (d < 0 ? 1 : -1) * $(this).data("amount"));
                    });
                }
                w.d.intHTML.on(g.eStart, "ul", function(e, f) {
                    if (!g.move) {
                        if (typeof f !== "undefined") {
                            e = f;
                        }
                        g.move = true;
                        g.target = $(this).find("li").first();
                        g.pos = parseInt(g.target.css("marginTop").replace(/px/i, ""), 10);
                        g.start = e.type.substr(0, 5) === "touch" ? e.originalEvent.changedTouches[0].pageY : e.pageY;
                        g.end = false;
                        g.direc = dur ? -1 : 1;
                        g.velocity = 0;
                        g.time = Date.now();
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
            },
            slidebox: function() {
                var i, y, hRow, phRow, currentTerm, currentText, w = this, o = this.options, g = this.drag, uid = "ui-datebox-", slideBase = $("<div class='" + uid + "sliderow-int'></div>"), phBase = $("<div>"), ctrl = $("<div>", {
                    "class": uid + "slide"
                });
                if (typeof w.d.intHTML !== "boolean") {
                    w.d.intHTML.remove().empty();
                } else {
                    w.d.input.on("datebox", function(e, p) {
                        if (p.method === "postrefresh") {
                            w._sbox_pos();
                        }
                    });
                }
                w.d.headerText = w._grabLabel() !== false ? w._grabLabel() : w.__("titleDateDialogLabel");
                w.d.intHTML = $("<span class='" + uid + "nopad'>");
                w.fldOrder = w.__("slideFieldOrder");
                w._check();
                w._minStepFix();
                $("<div class='" + uid + "header'><h4>" + w._formatter(w.__("headerFormat"), w.theDate) + "</h4></div>").appendTo(w.d.intHTML);
                w.d.intHTML.append(ctrl);
                for (y = 0; y < w.fldOrder.length; y++) {
                    currentTerm = w.fldOrder[y];
                    phRow = phBase.clone().addClass(uid + "sliderow").data("rowtype", currentTerm);
                    hRow = slideBase.clone().data("rowtype", currentTerm).appendTo(phRow);
                    if (w.__("isRTL") === true) {
                        hRow.css("direction", "rtl");
                    }
                    if (typeof w._sbox_mktxt[currentTerm] === "function") {
                        for (i = o.slen[currentTerm] * -1; i < o.slen[currentTerm] + 1; i++) {
                            currentText = w._sbox_mktxt[currentTerm].apply(w, [ i ]);
                            $("<div>", {
                                "class": uid + "slidebox " + uid + currentText[0] + o.btnCls + (i === 0 ? o.themeDatePick : o.themeDate)
                            }).html(currentText[1]).data("offset", i).appendTo(hRow);
                        }
                        if (w.baseMode === "bootstrap") {
                            phRow.find(".btn-sm").removeClass("btn-sm").addClass("btn-xs");
                        }
                        phRow.appendTo(ctrl);
                    }
                }
                if (o.useSetButton || o.useClearButton || o.useCancelButton || o.useTodayButton || o.useTomorrowButton) {
                    y = $("<div>", {
                        "class": uid + "controls " + uid + "repad"
                    });
                    if (o.useSetButton) {
                        y.append(w._stdBtn.close.apply(w, [ w.__("setDateButtonLabel") ]));
                    }
                    if (o.useTodayButton) {
                        y.append(w._stdBtn.today.apply(w));
                    }
                    if (o.useTomorrowButton) {
                        y.append(w._stdBtn.tomorrow.apply(w));
                    }
                    if (o.useClearButton) {
                        y.append(w._stdBtn.clear.apply(w));
                    }
                    if (o.useCancelButton) {
                        y.append(w._stdBtn.cancel.apply(w));
                    }
                    w._controlGroup(y).appendTo(w.d.intHTML);
                }
                if (w.wheelExists) {
                    w.d.intHTML.on("mousewheel", ".ui-datebox-sliderow-int", function(e, d) {
                        e.preventDefault();
                        w._offset($(this).data("rowtype"), (d < 0 ? -1 : 1) * ($(this).data("rowtype") === "i" ? o.minuteStep : 1));
                    });
                }
                w.d.intHTML.on(o.clickEvent, ".ui-datebox-sliderow-int>div", function(e) {
                    e.preventDefault();
                    w._offset($(this).parent().data("rowtype"), parseInt($(this).data("offset"), 10));
                });
                w.d.intHTML.on(g.eStart, ".ui-datebox-sliderow-int", function(e) {
                    if (!g.move) {
                        g.move = true;
                        g.target = $(this);
                        g.pos = parseInt(g.target.css("marginLeft").replace(/px/i, ""), 10);
                        g.start = e.type.substr(0, 5) === "touch" ? e.originalEvent.changedTouches[0].pageX : e.pageX;
                        g.end = false;
                        g.velocity = 0;
                        g.time = Date.now();
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
            }
        },
        _drag: {
            "default": function() {
                return false;
            },
            timeflipbox: function() {
                this._drag.flipbox.apply(this);
            },
            durationflipbox: function() {
                this._drag.flipbox.apply(this);
            },
            flipbox: function() {
                var w = this, o = this.options, g = this.drag;
                $(document).on(g.eMove, function(e) {
                    if (g.move && o.mode.slice(-7) === "flipbox") {
                        g.end = e.type.substr(0, 5) === "touch" ? e.originalEvent.changedTouches[0].pageY : e.pageY;
                        g.target.css("marginTop", g.pos + g.end - g.start + "px");
                        g.elapsed = Date.now() - g.time;
                        g.velocity = .8 * (100 * (g.end - g.start) / (1 + g.elapsed)) + .2 * g.velocity;
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                });
                $(document).on(g.eEnd, function(e) {
                    var eachItem, delta, currentPosition, goodPosition, totalMove, numberFull, goodGuess;
                    if (g.move && o.mode.slice(-7) === "flipbox") {
                        if (g.velocity < 15 && g.velocity > -15 || !o.useKinetic) {
                            g.move = false;
                            if (g.end !== false) {
                                e.preventDefault();
                                e.stopPropagation();
                                g.tmp = g.target.parent().parent();
                                w._offset(g.tmp.data("field"), parseInt((g.start - g.end) / (g.target.outerHeight() - 2), 10) * g.tmp.data("amount") * g.direc);
                            }
                            g.start = false;
                            g.end = false;
                        } else {
                            g.move = false;
                            g.start = false;
                            g.end = false;
                            g.tmp = g.target.parent().parent();
                            eachItem = g.target.outerHeight();
                            delta = -(g.velocity * .8) * Math.exp(-g.elapsed / 325) * 8 * -1;
                            currentPosition = parseInt(g.target.css("marginTop").replace(/px/i, ""), 10);
                            goodPosition = parseInt(currentPosition + delta, 10);
                            totalMove = g.pos - goodPosition;
                            numberFull = Math.round(totalMove / eachItem);
                            goodGuess = numberFull * g.tmp.data("amount") * g.direc;
                            g.target.animate({
                                marginTop: goodPosition
                            }, parseInt(1e4 / g.velocity) + 1e3, function() {
                                w._offset(g.tmp.data("field"), goodGuess);
                            });
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                });
            },
            slidebox: function() {
                var w = this, o = this.options, g = this.drag;
                $(document).on(g.eMove, function(e) {
                    if (g.move && o.mode === "slidebox") {
                        g.end = e.type.substr(0, 5) === "touch" ? e.originalEvent.changedTouches[0].pageX : e.pageX;
                        g.target.css("marginLeft", g.pos + g.end - g.start + "px");
                        g.elapsed = Date.now() - g.time;
                        g.velocity = .8 * (100 * (g.end - g.start) / (1 + g.elapsed)) + .2 * g.velocity;
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                });
                $(document).on(g.eEnd, function(e) {
                    var eachItem, delta, currentPosition, goodPosition, totalMove, numberFull, goodGuess;
                    if (g.move && o.mode === "slidebox") {
                        if (g.velocity < 15 && g.velocity > -15 || !o.useKinetic) {
                            g.move = false;
                            if (g.end !== false) {
                                e.preventDefault();
                                e.stopPropagation();
                                g.tmp = g.target.find("div").first();
                                w._offset(g.target.data("rowtype"), (w.__("isRTL") ? -1 : 1) * parseInt((g.start - g.end) / g.tmp.innerWidth(), 10) * (g.target.data("rowtype") === "i" ? o.minuteStep : 1));
                            }
                            g.start = false;
                            g.end = false;
                        } else {
                            g.move = false;
                            g.start = false;
                            g.end = false;
                            g.tmp = g.target.find("div").first();
                            eachItem = g.tmp.innerWidth();
                            delta = -(g.velocity * .8) * Math.exp(-g.elapsed / 325) * 8 * -1;
                            currentPosition = parseInt(g.target.css("marginLeft").replace(/px/i, ""), 10);
                            goodPosition = parseInt(currentPosition + delta, 10);
                            totalMove = g.pos - goodPosition;
                            numberFull = Math.round(totalMove / eachItem);
                            goodGuess = numberFull * (g.target.data("rowtype") === "i" ? o.minuteStep : 1);
                            g.target.animate({
                                marginLeft: goodPosition
                            }, parseInt(1e4 / g.velocity) + 1e3, function() {
                                w._offset(g.target.data("rowtype"), goodGuess);
                            });
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                });
            }
        },
        _offset: function(mode, amount, update) {
            var w = this, o = this.options, now = this.theDate, ok = false, tempBad, bad = false, monthEnd = 32 - w.theDate.copy([ 0 ], [ 0, 0, 32, 13 ]).getDate(), dPart = false;
            mode = (mode || "").toLowerCase();
            dPart = $.inArray(mode, [ "y", "m", "d", "h", "i", "s" ]);
            if (typeof update === "undefined") {
                update = true;
            }
            if (mode !== "a" && (typeof o.rolloverMode[mode] === "undefined" || o.rolloverMode[mode] === true)) {
                ok = dPart;
            } else {
                switch (mode) {
                  case "y":
                    ok = 0;
                    break;

                  case "m":
                    if (w._btwn(now.get(1) + amount, -1, 12)) {
                        ok = 1;
                    } else {
                        tempBad = now.get(1) + amount;
                        if (tempBad < 0) {
                            bad = [ 1, 12 + tempBad ];
                        } else {
                            bad = [ 1, tempBad % 12 ];
                        }
                    }
                    break;

                  case "d":
                    if (w._btwn(now.get(2) + amount, 0, monthEnd + 1)) {
                        ok = 2;
                    } else {
                        tempBad = now.get(2) + amount;
                        if (tempBad < 1) {
                            bad = [ 2, monthEnd + tempBad ];
                        } else {
                            bad = [ 2, tempBad % monthEnd ];
                        }
                    }
                    break;

                  case "h":
                    if (w._btwn(now.get(3) + amount, -1, 24)) {
                        ok = 3;
                    } else {
                        tempBad = now.get(3) + amount;
                        if (tempBad < 0) {
                            bad = [ 3, 24 + tempBad ];
                        } else {
                            bad = [ 3, tempBad % 24 ];
                        }
                    }
                    break;

                  case "i":
                    if (w._btwn(now.get(4) + amount, -1, 60)) {
                        ok = 4;
                    } else {
                        tempBad = now.get(4) + amount;
                        if (tempBad < 0) {
                            bad = [ 4, 59 + tempBad ];
                        } else {
                            bad = [ 4, tempBad % 60 ];
                        }
                    }
                    break;

                  case "s":
                    if (w._btwn(now.get(5) + amount, -1, 60)) {
                        ok = 5;
                    } else {
                        tempBad = now.get(5) + amount;
                        if (tempBad < 0) {
                            bad = [ 5, 59 + tempBad ];
                        } else {
                            bad = [ 5, tempBad % 60 ];
                        }
                    }
                    break;

                  case "a":
                    w._offset("h", (amount > 0 ? 1 : -1) * 12, false);
                    break;
                }
            }
            if (ok !== false) {
                w.theDate.adj(ok, amount);
            } else {
                w.theDate.setD(bad[0], bad[1]);
            }
            if (update === true) {
                w.refresh();
            }
            if (o.useImmediate) {
                w._t({
                    method: "doset"
                });
            }
            if (w.calBackDate !== false) {
                w._t({
                    method: "displayChange",
                    selectedDate: w.calBackDate,
                    shownDate: w.theDate,
                    thisChange: mode,
                    thisChangeAmount: amount
                });
            }
            w._t({
                method: "offset",
                type: mode,
                amount: amount,
                newDate: w.theDate
            });
        },
        _startOffset: function(date) {
            var o = this.options;
            if (o.startOffsetYears !== false) {
                date.adj(0, o.startOffsetYears);
            }
            if (o.startOffsetMonths !== false) {
                date.adj(1, o.startOffsetMonths);
            }
            if (o.startOffsetDays !== false) {
                date.adj(2, o.startOffsetDays);
            }
            return date;
        },
        getTheDate: function() {
            if (this.calBackDate !== false) {
                return this.calBackDate;
            }
            return this.theDate;
        },
        getLastDur: function() {
            return this.lastDuration;
        },
        dateVisible: function() {
            return this.calDateVisible;
        },
        setTheDate: function(newDate) {
            if (typeof newDate === "object") {
                this.theDate = newDate;
            } else {
                this.theDate = this._makeDate(newDate);
            }
            this.refresh();
            this._t({
                method: "doset"
            });
        },
        parseDate: function(format, strdate) {
            var retty, w = this;
            w.fmtOver = format;
            retty = w._makeDate(strdate);
            w.fmtOver = false;
            return retty;
        },
        callFormat: function(format, date, allowArIn) {
            if (typeof allowArIn === "undefined") {
                allowArIn = false;
            }
            return this._formatter(format, date, allowArIn);
        },
        refresh: function() {
            var w = this, o = this.options;
            if (typeof w._build[o.mode] === "undefined") {
                w._build["default"].apply(w, []);
            } else {
                w._build[o.mode].apply(w, []);
            }
            if (w.__("useArabicIndic") === true) {
                w._doIndic();
            }
            w.d.mainWrap.append(w.d.intHTML);
            w._t({
                method: "postrefresh"
            });
        },
        applyMinMax: function(refresh, override) {
            var todayClean, fromEl, fromElDate, daysRaw, w = this, o = this.options, today = new this._date(), lod = 24 * 60 * 60 * 1e3;
            todayClean = w._pa([ 0, 0, 0 ], today);
            if (typeof refresh === "undefined") {
                refresh = true;
            }
            if (typeof override === "undefined") {
                override = true;
            }
            if ((override === true || o.minDays === false) && typeof w.d.input.attr("min") !== "undefined") {
                fromEl = w.d.input.attr("min").split("-");
                fromElDate = new w._date(fromEl[0], fromEl[1] - 1, fromEl[2], 0, 0, 0, 0);
                daysRaw = (fromElDate.getTime() - todayClean.getTime()) / lod;
                o.minDays = parseInt(daysRaw * -1, 10);
            }
            if ((override === true || o.maxDays === false) && typeof w.d.input.attr("max") !== "undefined") {
                fromEl = w.d.input.attr("max").split("-");
                fromElDate = new w._date(fromEl[0], fromEl[1] - 1, fromEl[2], 0, 0, 0, 0);
                daysRaw = (fromElDate.getTime() - todayClean.getTime()) / lod;
                o.maxDays = parseInt(daysRaw, 10);
            }
            if (refresh === true) {
                w._t({
                    method: "refresh"
                });
            }
        },
        _dur: function(ms) {
            var theDuration = [ ms / (60 * 60 * 1e3 * 24), ms / (60 * 60 * 1e3) % 24, ms / (60 * 1e3) % 60, ms / 1e3 % 60 ];
            $.each(theDuration, function(index, value) {
                if (value < 0) {
                    theDuration[index] = 0;
                } else {
                    theDuration[index] = Math.floor(value);
                }
            });
            return theDuration;
        },
        __: function(val) {
            var o = this.options, lang = o.lang[o.useLang], mode = o[o.mode + "lang"], oride = "override" + val.charAt(0).toUpperCase() + val.slice(1);
            if (typeof o[oride] !== "undefined") {
                return o[oride];
            }
            if (typeof lang !== "undefined" && typeof lang[val] !== "undefined") {
                return lang[val];
            }
            if (typeof mode !== "undefined" && typeof mode[val] !== "undefined") {
                return mode[val];
            }
            if (typeof o.lang["default"][val] !== "undefined") {
                return o.lang["default"][val];
            }
            return "Err:NotFound";
        },
        __fmt: function() {
            var w = this, o = this.options;
            if (typeof w.fmtOver !== "undefined" && w.fmtOver !== false) {
                return w.fmtOver;
            }
            switch (o.mode) {
              case "timebox":
              case "timeflipbox":
                return w.__("timeOutput");

              case "durationbox":
              case "durationflipbox":
                return w.__("durationFormat");

              default:
                return w.__("dateFormat");
            }
        },
        _zPad: function(number, pad) {
            if (typeof pad !== "undefined" && pad === "-") {
                return String(number);
            }
            return (number < 10 ? "0" : "") + String(number);
        },
        _dRep: function(oper, direction) {
            var ch, i, start = 48, end = 57, adder = 1584, newString = "";
            if (direction === -1) {
                start += adder;
                end += adder;
                adder = -1584;
            }
            for (i = 0; i < oper.length; i++) {
                ch = oper.charCodeAt(i);
                if (ch >= start && ch <= end) {
                    newString = newString + String.fromCharCode(ch + adder);
                } else {
                    newString = newString + String.fromCharCode(ch);
                }
            }
            return newString;
        },
        _doIndic: function() {
            var w = this;
            w.d.intHTML.find("*").each(function() {
                if ($(this).children().length < 1) {
                    $(this).text(w._dRep($(this).text()));
                } else if ($(this).hasClass("ui-datebox-slideday")) {
                    $(this).html(w._dRep($(this).html()));
                }
            });
            w.d.intHTML.find("input").each(function() {
                $(this).val(w._dRep($(this).val()));
            });
        },
        _n: function(val, def) {
            return val < 0 ? def : val;
        },
        _pa: function(arr, date) {
            if (typeof date === "boolean") {
                return new this._date(arr[0], arr[1], arr[2], 0, 0, 0, 0);
            }
            return new this._date(date.get(0), date.get(1), date.get(2), arr[0], arr[1], arr[2], 0);
        },
        _btwn: function(value, low, high) {
            return value > low && value < high;
        },
        _grabLabel: function() {
            var inputPlaceholder, inputTitle, w = this, o = this.options, tmp = false;
            if (typeof o.overrideDialogLabel === "undefined") {
                inputPlaceholder = w.d.input.attr("placeholder");
                inputTitle = w.d.input.attr("title");
                if (typeof inputPlaceholder !== "undefined") {
                    return inputPlaceholder;
                }
                if (typeof inputTitle !== "undefined") {
                    return inputTitle;
                }
                tmp = $(document).find("label[for='" + w.d.input.attr("id") + "']").text();
                return tmp === "" ? false : tmp;
            }
            return o.overrideDialogLabel;
        },
        _t: function(obj) {
            this.d.input.trigger("datebox", obj);
        },
        _spf: function(text, repl) {
            if (!$.isArray(repl) && !$.isPlainObject(repl)) {
                return text;
            }
            return text.replace(/{(.+?)}/g, function(match, oper) {
                return repl[oper];
            });
        },
        _cal_gen: function(start, prev, last, other, month) {
            var rc = 0, cc = 0, day = 1, next = 1, cal = [], row = [], stop = false;
            for (rc = 0; rc <= 5; rc++) {
                if (stop === false) {
                    row = [];
                    for (cc = 0; cc <= 6; cc++) {
                        if (rc === 0 && cc < start) {
                            if (other === true) {
                                row.push([ prev + (cc - start) + 1, month - 1 ]);
                            } else {
                                row.push(" ");
                            }
                        } else if (rc > 3 && day > last) {
                            if (other === true) {
                                row.push([ next, month + 1 ]);
                                next++;
                            } else {
                                row.push(" ");
                            }
                            stop = true;
                        } else {
                            row.push([ day, month ]);
                            day++;
                            if (day > last) {
                                stop = true;
                            }
                        }
                    }
                    cal.push(row);
                }
            }
            return cal;
        },
        _cal_check: function(checkDates, year, month, date, done) {
            var w = this, i, o = this.options, maxDate = done.x, minDate = done.i, thisDate = done.t, presetDay = done.p, day = new this._date(year, month, date, 12, 0, 0, 0).getDay(), bdRec = o.blackDatesRec, hdRec = o.highDatesRec, ret = {
                ok: true,
                iso: year + "-" + w._zPad(month + 1) + "-" + w._zPad(date),
                theme: o.themeDate,
                force: false,
                recok: true,
                rectheme: false
            };
            if (month === 12) {
                ret.iso = year + 1 + "-01-" + w._zPad(date);
            }
            if (month === -1) {
                ret.iso = year - 1 + "-12-" + w._zPad(date);
            }
            ret.comp = parseInt(ret.iso.replace(/-/g, ""), 10);
            if (bdRec !== false) {
                for (i = 0; i < bdRec.length; i++) {
                    if ((bdRec[i][0] === -1 || bdRec[i][0] === year) && (bdRec[i][1] === -1 || bdRec[i][1] === month) && (bdRec[i][2] === -1 || bdRec[i][2] === date)) {
                        ret.ok = false;
                    }
                }
            }
            if ($.isArray(o.enableDates) && $.inArray(ret.iso, o.enableDates) < 0) {
                ret.ok = false;
            } else if (checkDates) {
                if (ret.recok !== true || o.afterToday && thisDate.comp() > ret.comp || o.beforeToday && thisDate.comp() < ret.comp || o.notToday && thisDate.comp() === ret.comp || o.maxDays !== false && maxDate.comp() < ret.comp || o.minDays !== false && minDate.comp() > ret.comp || $.isArray(o.blackDays) && $.inArray(day, o.blackDays) > -1 || $.isArray(o.blackDates) && $.inArray(ret.iso, o.blackDates) > -1) {
                    ret.ok = false;
                }
            }
            if ($.isArray(o.whiteDates) && $.inArray(ret.iso, o.whiteDates) > -1) {
                ret.ok = true;
            }
            if (ret.ok) {
                if (hdRec !== false) {
                    for (i = 0; i < hdRec.length; i++) {
                        if ((hdRec[i][0] === -1 || hdRec[i][0] === year) && (hdRec[i][1] === -1 || hdRec[i][1] === month) && (hdRec[i][2] === -1 || hdRec[i][2] === date)) {
                            ret.rectheme = true;
                        }
                    }
                }
                if (o.calHighPick && date === presetDay && (w.d.input.val() !== "" || o.defaultValue !== false)) {
                    ret.theme = o.themeDatePick;
                } else if (o.calHighToday && ret.comp === thisDate.comp()) {
                    ret.theme = o.themeDateToday;
                } else if (o.calHighPick && w.calDateVisible && w.calBackDate !== false && w.calBackDate.comp() === ret.comp) {
                    ret.theme = o.themeDatePick;
                    ret.force = true;
                } else if ($.isArray(o.highDatesAlt) && $.inArray(ret.iso, o.highDatesAlt) > -1) {
                    ret.theme = o.themeDateHighAlt;
                } else if ($.isArray(o.highDates) && $.inArray(ret.iso, o.highDates) > -1) {
                    ret.theme = o.themeDateHigh;
                } else if ($.isArray(o.highDays) && $.inArray(day, o.highDays) > -1) {
                    ret.theme = o.themeDayHigh;
                } else if ($.isArray(o.highDatesRec) && ret.rectheme === true) {
                    ret.theme = o.themeDateHighRec;
                }
            } else {
                ret.theme = o.disabledState;
            }
            return ret;
        },
        _cal_prev_next: function(container) {
            var w = this, o = this.options, uid = "ui-datebox-";
            $(w._spf("<div class='{class}'><a href='#'>{name}</a></div>", {
                "class": uid + "gridplus text-right button-datebox" + (w.__("isRTL") ? "-rtl" : ""),
                name: w._spf(o.s.cal.nextMonth, {
                    text: w.__("nextMonth"),
                    icon: o.calNextMonthIcon
                })
            })).prependTo(container).find("a").addClass(function() {
                switch (w.baseMode) {
                  case "jqm":
                    return o.btnCls + o.themeDate + o.icnCls + o.calNextMonthIcon;

                  case "bootstrap":
                  case "bootstrap4":
                    return o.btnCls + o.themeDate + " btn-cal-month pull-" + (w.__("isRTL") ? "left" : "right");

                  default:
                    return null;
                }
            }).on(o.clickEventAlt, function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (w.calNext) {
                    if (w.calBackDate === false) {
                        w.calBackDate = new Date(w.theDate.getTime());
                    }
                    if (w.theDate.getDate() > 28) {
                        w.theDate.setDate(1);
                    }
                    w._offset("m", 1);
                }
                return false;
            });
            $(w._spf("<div class='{class}'><a href='#'>{name}</a></div>", {
                "class": uid + "gridminus text-left button-datebox" + (w.__("isRTL") ? "-rtl" : ""),
                name: w._spf(o.s.cal.prevMonth, {
                    text: w.__("prevMonth"),
                    icon: o.calPrevMonthIcon
                })
            })).prependTo(container).find("a").addClass(function() {
                switch (w.baseMode) {
                  case "jqm":
                    return o.btnCls + o.themeDate + o.icnCls + o.calPrevMonthIcon;

                  case "bootstrap":
                  case "bootstrap4":
                    return o.btnCls + o.themeDate + " btn-cal-month pull-" + (w.__("isRTL") ? "right" : "left");

                  default:
                    return null;
                }
            }).on(o.clickEventAlt, function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (w.calPrev) {
                    if (w.calBackDate === false) {
                        w.calBackDate = new Date(w.theDate.getTime());
                    }
                    if (w.theDate.getDate() > 28) {
                        w.theDate.setDate(1);
                    }
                    w._offset("m", -1);
                }
                return false;
            });
        },
        _cal_pickers: function(curMonth, curYear, cTodayDateArr) {
            var prangeS, prangeL, i, w = this, o = this.options, uid = "ui-datebox-", realCurYear = new Date().get(0), pickerControl = $("<div>").addClass("ui-datebox-cal-pickers");
            if (o.calNoHeader && o.calUsePickersIcons) {
                pickerControl.addClass("ui-datebox-pickicon");
            }
            pickerControl.i = $("<fieldset>").appendTo(pickerControl);
            pickerControl.a = $("<select>").appendTo(pickerControl.i);
            pickerControl.b = $("<select>").appendTo(pickerControl.i);
            for (i = 0; i <= 11; i++) {
                pickerControl.a.append($("<option value='" + i + "'" + (curMonth === i ? " selected='selected'" : "") + ">" + w.__("monthsOfYear")[i] + "</option>"));
            }
            if (o.calYearPickMin < 1) {
                prangeS = (o.calYearPickRelative ? curYear : realCurYear) + o.calYearPickMin;
            } else if (o.calYearPickMin < 1800) {
                prangeS = (o.calYearPickRelative ? curYear : realCurYear) - o.calYearPickMin;
            } else if (o.calYearPickMin === "NOW") {
                prangeS = cTodayDateArr[0];
            } else {
                prangeS = o.calYearPickMin;
            }
            if (o.calYearPickMax < 1800) {
                prangeL = (o.calYearPickRelative ? curYear : realCurYear) + o.calYearPickMax;
            } else if (o.calYearPickMax === "NOW") {
                prangeL = cTodayDateArr[0];
            } else {
                prangeL = o.calYearPickMax;
            }
            for (i = prangeS; i <= prangeL; i++) {
                pickerControl.b.append($("<option value='" + i + "'" + (curYear === i ? " selected='selected'" : "") + ">" + i + "</option>"));
            }
            pickerControl.a.on("change", function() {
                if (w.calBackDate === false) {
                    w.calBackDate = new Date(w.theDate.getTime());
                }
                w.theDate.setD(1, $(this).val());
                if (w.theDate.get(1) !== parseInt($(this).val(), 10)) {
                    w.theDate.setD(2, 0);
                }
                if (w.calBackDate !== false) {
                    w._t({
                        method: "displayChange",
                        selectedDate: w.calBackDate,
                        shownDate: w.theDate,
                        thisChange: "p",
                        thisChangeAmount: null
                    });
                }
                w.refresh();
            });
            pickerControl.b.on("change", function() {
                if (w.calBackDate === false) {
                    w.calBackDate = new Date(w.theDate.getTime());
                }
                w.theDate.setD(0, $(this).val());
                if (w.theDate.get(1) !== parseInt(pickerControl.a.val(), 10)) {
                    w.theDate.setD(2, 0);
                }
                if (w.calBackDate !== false) {
                    w._t({
                        method: "displayChange",
                        selectedDate: w.calBackDate,
                        shownDate: w.theDate,
                        thisChange: "p",
                        thisChangeAmount: null
                    });
                }
                w.refresh();
            });
            switch (w.baseMode) {
              case "bootstrap":
              case "jqueryui":
                pickerControl.i.find("select").addClass("form-control input-sm").css({
                    marginTop: "3px",
                    "float": "left"
                }).first().css({
                    width: "60%"
                }).end().last().css({
                    width: "40%"
                });
                if (o.calNoHeader && o.calUsePickersIcons) {
                    w.d.intHTML.find("." + uid + "gridheader").append(pickerControl);
                } else {
                    pickerControl.appendTo(w.d.intHTML);
                }
                break;

              case "bootstrap4":
                pickerControl.i.find("select").addClass("form-control form-control-sm input-sm").css({
                    marginTop: "3px",
                    "float": "left",
                    height: "auto"
                }).first().css({
                    width: "60%"
                }).end().last().css({
                    width: "40%"
                });
                if (o.calNoHeader && o.calUsePickersIcons) {
                    w.d.intHTML.find("." + uid + "gridheader").append(pickerControl);
                } else {
                    pickerControl.appendTo(w.d.intHTML);
                }
                break;

              case "jqm":
                pickerControl.i.controlgroup({
                    mini: true,
                    type: "horizontal"
                });
                pickerControl.i.find("select").selectmenu({
                    nativeMenu: true
                });
                pickerControl.i.find(".ui-controlgroup-controls").css({
                    marginRight: "auto",
                    marginLeft: "auto",
                    width: "100%",
                    display: "table"
                });
                pickerControl.i.find(".ui-select").first().css({
                    width: "60%"
                }).end().last().css({
                    width: "40%"
                });
                if (o.calNoHeader && o.calUsePickersIcons) {
                    pickerControl.i.css({
                        padding: "0 10px 5px 10px"
                    });
                }
                pickerControl.appendTo(w.d.intHTML);
                break;
            }
        },
        _cal_date_list: function(calContent) {
            var i, tempVal, w = this, o = this.options, listControl = $("<div>").addClass("ui-datebox-pickcontrol");
            listControl.a = $("<select name='pickdate'></select>").appendTo(listControl);
            listControl.a.append("<option value='false' selected='selected'>" + w.__("calDateListLabel") + "</option>");
            for (i = 0; i < o.calDateList.length; i++) {
                listControl.a.append($(w._spf("<option value='{0}'>{1}</option>", o.calDateList[i])));
            }
            listControl.a.on("change", function() {
                tempVal = $(this).val().split("-");
                w.theDate = new w._date(tempVal[0], tempVal[1] - 1, tempVal[2], 0, 0, 0, 0);
                w._t({
                    method: "doset"
                });
            });
            switch (w.baseMode) {
              case "jqm":
                listControl.find("select").selectmenu({
                    mini: true,
                    nativeMenu: true
                });
                break;

              case "bootstrap":
              case "bootstrap4":
                listControl.find("select").addClass("form-control input-sm");
                break;
            }
            listControl.appendTo(calContent);
        },
        _dbox_run: function() {
            var w = this, g = this.drag, timer = parseInt(6.09 + 142.8 * Math.pow(Math.E, -.039 * g.cnt), 10);
            g.didRun = true;
            g.cnt++;
            w._offset(g.target[0], g.target[1], false);
            w._dbox_run_update();
            w.runButton = setTimeout(function() {
                w._dbox_run();
            }, timer);
        },
        _dbox_run_update: function(shortRun) {
            var w = this, o = this.options, i = w.theDate.getTime() - w.initDate.getTime(), dur = o.mode === "durationbox" ? true : false, cDur = w._dur(i < 0 ? 0 : i);
            if (i < 0) {
                w.lastDuration = 0;
                if (dur) {
                    w.theDate.setTime(w.initDate.getTime());
                }
            }
            if (dur) {
                w.lastDuration = i / 1e3;
                if (o.minDur !== false && w.theDate.getEpoch() - w.initDate.getEpoch() < o.minDur) {
                    w.theDate = new Date(w.initDate.getTime() + o.minDur * 1e3);
                    w.lastDuration = o.minDur;
                    cDur = w._dur(o.minDur * 1e3);
                }
                if (o.maxDur !== false && w.theDate.getEpoch() - w.initDate.getEpoch() > o.maxDur) {
                    w.theDate = new Date(w.initDate.getTime() + o.maxDur * 1e3);
                    w.lastDuration = o.maxDur;
                    cDur = w._dur(o.maxDur * 1e3);
                }
            }
            if (shortRun !== true && dur !== true) {
                w._check();
                if (o.mode === "datebox") {
                    w.d.intHTML.find(".ui-datebox-header").find("h4").text(w._formatter(w.__("headerFormat"), w.theDate));
                }
                if (o.useSetButton) {
                    if (w.dateOK === false) {
                        w.setBut.addClass(o.disabledState);
                    } else {
                        w.setBut.removeClass(o.disabledState);
                    }
                }
            }
            w.d.divIn.find("input").each(function() {
                switch ($(this).data("field")) {
                  case "y":
                    $(this).val(w.theDate.get(0));
                    break;

                  case "m":
                    $(this).val(w.theDate.get(1) + 1);
                    break;

                  case "d":
                    $(this).val(dur ? cDur[0] : w.theDate.get(2));
                    break;

                  case "h":
                    if (dur) {
                        $(this).val(cDur[1]);
                    } else {
                        if (w.__("timeFormat") === 12) {
                            $(this).val(w.theDate.get12hr());
                        } else {
                            $(this).val(w.theDate.get(3));
                        }
                    }
                    break;

                  case "i":
                    if (dur) {
                        $(this).val(cDur[2]);
                    } else {
                        $(this).val(w._zPad(w.theDate.get(4)));
                    }
                    break;

                  case "M":
                    $(this).val(w.__("monthsOfYearShort")[w.theDate.get(1)]);
                    break;

                  case "a":
                    $(this).val(w.__("meridiem")[w.theDate.get(3) > 11 ? 1 : 0]);
                    break;

                  case "s":
                    if (dur) {
                        $(this).val(cDur[3]);
                    } else {
                        $(this).val(w._zPad(w.theDate.get(5)));
                    }
                    break;
                }
            });
            if (w.__("useArabicIndic") === true) {
                w._doIndic();
            }
        },
        _dbox_vhour: function(delta) {
            var w = this, o = this.options, tmp, closeya = [ 25, 0 ], closenay = [ 25, 0 ];
            if (o.validHours === false) {
                return true;
            }
            if ($.inArray(w.theDate.getHours(), o.validHours) > -1) {
                return true;
            }
            tmp = w.theDate.getHours();
            $.each(o.validHours, function() {
                if ((tmp < this ? 1 : -1) === delta) {
                    if (closeya[0] > Math.abs(this - tmp)) {
                        closeya = [ Math.abs(this - tmp), parseInt(this, 10) ];
                    }
                } else {
                    if (closenay[0] > Math.abs(this - tmp)) {
                        closenay = [ Math.abs(this - tmp), parseInt(this, 10) ];
                    }
                }
            });
            if (closeya[1] !== 0) {
                w.theDate.setHours(closeya[1]);
            } else {
                w.theDate.setHours(closenay[1]);
            }
        },
        _dbox_enter: function(item) {
            var tmp, w = this, t = 0;
            if (item.data("field") === "M") {
                tmp = $.inArray(item.val(), w.__("monthsOfYearShort"));
                if (tmp > -1) {
                    w.theDate.setMonth(tmp);
                }
            }
            if (item.val() !== "" && item.val().toString().search(/^[0-9]+$/) === 0) {
                switch (item.data("field")) {
                  case "y":
                    w.theDate.setD(0, parseInt(item.val(), 10));
                    break;

                  case "m":
                    w.theDate.setD(1, parseInt(item.val(), 10) - 1);
                    break;

                  case "d":
                    w.theDate.setD(2, parseInt(item.val(), 10));
                    t += 60 * 60 * 24 * parseInt(item.val(), 10);
                    break;

                  case "h":
                    w.theDate.setD(3, parseInt(item.val(), 10));
                    t += 60 * 60 * parseInt(item.val(), 10);
                    break;

                  case "i":
                    w.theDate.setD(4, parseInt(item.val(), 10));
                    t += 60 * parseInt(item.val(), 10);
                    break;

                  case "s":
                    w.theDate.setD(5, parseInt(item.val(), 10));
                    t += parseInt(item.val(), 10);
                    break;
                }
            }
            if (this.options.mode === "durationbox") {
                w.theDate.setTime(w.initDate.getTime() + t * 1e3);
            }
            setTimeout(function() {
                w.refresh();
            }, 150);
        },
        _dbox_button: function(direction, field, amount) {
            var w = this, o = this.options;
            return $("<div>").addClass("ui-datebox-datebox-button").addClass(o.btnCls + o.themeButton).addClass(function() {
                switch (w.baseMode) {
                  case "jqm":
                  case "bootstrap":
                  case "bootstrap4":
                    return 'fas fa-' + (direction > 0 ? 'chevron-up' : 'chevron-down');

                  default:
                    return null;
                }
            }).data({
                field: field,
                amount: amount * direction
            }).append(function() {
                switch (w.baseMode) {
                  case "jqueryui":
                    return $("<span>").addClass(o.icnCls + (direction > 0 ? o.calNextMonthIcon : o.calPrevMonthIcon));

                  default:
                    return null;
                }
            });
        },
        _fbox_pos: function() {
            var fixer, element, first, placement = 0, w = this, adj = w.baseMode === "bootstrap4" ? 5 : 0, parentHeight = this.d.intHTML.find(".ui-datebox-flipcontent").innerHeight();
            w.d.intHTML.find(".ui-datebox-flipcenter").each(function() {
                element = $(this);
                placement = (parentHeight / 2 - element.innerHeight() / 2 - 3) * -1 + adj;
                element.css("top", placement);
            });
            w.d.intHTML.find("ul").each(function() {
                element = $(this);
                parentHeight = element.parent().innerHeight();
                first = element.find("li").first();
                fixer = element.find("li").last().offset().top - element.find("li").first().offset().top;
                first.css("marginTop", ((fixer - parentHeight) / 2 + first.outerHeight()) * -1);
            });
        },
        _fbox_series: function(middle, side, type, neg) {
            var nxt, prv, o = this.options, maxval = type === "h" ? 24 : 60, ret = [ [ middle.toString(), middle ] ];
            for (var i = 1; i <= side; i++) {
                nxt = middle + i * o.durationSteppers[type];
                prv = middle - i * o.durationSteppers[type];
                ret.unshift([ nxt.toString(), nxt ]);
                if (prv > -1) {
                    ret.push([ prv.toString(), prv ]);
                } else {
                    if (neg) {
                        ret.push([ (maxval + prv).toString(), prv ]);
                    } else {
                        ret.push([ "", -1 ]);
                    }
                }
            }
            return ret;
        },
        _fbox_mktxt: {
            y: function(i) {
                return this.theDate.get(0) + i;
            },
            m: function(i) {
                var testDate = this.theDate.copy([ 0 ], [ 0, 0, 1 ]).adj(1, i);
                return this.__("monthsOfYearShort")[testDate.get(1)];
            },
            d: function(i) {
                var w = this, o = this.options;
                if (o.rolloverMode === false || typeof o.rolloverMode.d !== "undefined" && o.rolloverMode.d === false) {
                    var today = this.theDate.get(2), lastDate = 32 - w.theDate.copy([ 0 ], [ 0, 0, 32, 13 ]).getDate(), tempDate = today + i;
                    if (tempDate < 1) {
                        return lastDate + tempDate;
                    } else {
                        if (tempDate % lastDate > 0) {
                            return tempDate % lastDate;
                        } else {
                            return lastDate;
                        }
                    }
                }
                return this.theDate.copy([ 0, 0, i ]).get(2);
            },
            h: function(i) {
                var testDate = this.theDate.copy([ 0, 0, 0, i ]);
                return this.__("timeFormat") === 12 ? testDate.get12hr() : testDate.get(3);
            },
            i: function(i) {
                return this._zPad(this.theDate.copy([ 0, 0, 0, 0, i ]).get(4));
            },
            s: function(i) {
                return this._zPad(this.theDate.copy([ 0, 0, 0, 0, 0, i ]).get(5));
            }
        },
        _sbox_pos: function() {
            var fixer, ech, top, par, tot, w = this;
            w.d.intHTML.find("div.ui-datebox-sliderow-int").each(function() {
                ech = $(this);
                par = ech.parent().outerWidth();
                fixer = ech.outerWidth();
                if (w.__("isRTL")) {
                    top = ech.find("div").last();
                } else {
                    top = ech.find("div").first();
                }
                tot = ech.find("div").length * top.outerWidth();
                if (fixer > 0) {
                    tot = fixer;
                }
                top.css("marginLeft", (tot - par) / 2 * -1);
            });
        },
        _sbox_mktxt: {
            y: function(i) {
                return [ "slideyear", this.theDate.get(0) + i ];
            },
            m: function(i) {
                var testDate = this.theDate.copy([ 0 ], [ 0, 0, 1 ]).adj(1, i);
                return [ "slidemonth", this.__("monthsOfYearShort")[testDate.get(1)] ];
            },
            d: function(i) {
                var testDate = this.theDate.copy([ 0, 0, i ]);
                return [ "slideday", testDate.get(2) + "<br /><span class='ui-datebox-slidewday'>" + this.__("daysOfWeekShort")[testDate.getDay()] + "</span>" ];
            },
            h: function(i) {
                var testDate = this.theDate.copy([ 0, 0, 0, i ]);
                return [ "slidehour", this.__("timeFormat") === 12 ? this._formatter("%-I<span class='ui-datebox-slidewday'>%p</span>", testDate) : testDate.get(3) ];
            },
            i: function(i) {
                return [ "slidemins", this._zPad(this.theDate.copy([ 0, 0, 0, 0, i ]).get(4)) ];
            }
        }
    });
})(jQuery);

(function($) {
    $(document).ready(function() {
        $("[data-role='datebox']").each(function() {
            $(this).datebox();
        });
    });
})(jQuery);