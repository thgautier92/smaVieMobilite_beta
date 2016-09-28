/**
 * Module       : docuSign
 * Fonction     : Intégration de la solution DocuSign
 * Auteur       : Th.GAUTIER - le 20/03/2016
 * Pre-requis   :  
 *                  https://www.docusign.com/p/RESTAPIGuide/RESTAPIGuide.htm
 *                  http://iodocs.docusign.com/
 * Class CSS    : bg-declined, bg-completed  
 */
angular.module('docuSign', [])
    .factory('docuSignApi', function($http, $q) {
        var rootApi = "https://demo.docusign.net/restapi/v2";
        if (!window.device){
            console.log("Proxy CORS added for Web application");
            rootApi = "/docuSign/restApi/v2"; // proxy CORS for Web Application    
        }
        var email = "thierry_gautier@groupe-sma.fr";
        var password = "Tga051163";
        var integratorKey = "TEST-43dd500e-9abc-42da-8beb-3d3f14698fbd";
        var account = "1549349";
        var header = "<DocuSignCredentials><Username>" + email + "</Username><Password>" + password + "</Password><IntegratorKey>" + integratorKey + "</IntegratorKey></DocuSignCredentials>";
        var http = {
            cache: false,
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-DocuSign-Authentication': header }
        };
        return {
            getAccount: function() {
                var deferred = $q.defer();
                var api = "login_information?api_password=false&include_account_id_guid=true&login_settings=all"
                http.url = rootApi + "/" + api;
                http.method = 'GET';
                http.responseType = "json";
                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            getTemplates: function() {
                var deferred = $q.defer();
                var api = "accounts/#account#/templates"
                api = api.replace("#account#", account);
                http.url = rootApi + "/" + api;
                http.method = 'GET';
                http.responseType = "json";
                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;

            },
            sendSignEnv: function(dataSend) {
                var deferred = $q.defer();
                var api = "accounts/#account#/envelopes"
                api = api.replace("#account#", account);
                http.url = rootApi + "/" + api;
                http.method = 'POST';
                http.responseType = "json";
                http.data = dataSend;
                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            getListEnv: function(yearView, monthView, numFolder) {
                var dateView = monthView + "/01/" + yearView;
                var deferred = $q.defer();
                var lstFolder = ["all", "drafts", "awaiting_my_signature", "completed", "out_for_signature"]
                var folder = lstFolder[numFolder];
                var api = "accounts/#account#/search_folders/" + folder + "?from_date=" + dateView + "&to_date=&start_position=&count=&order=DESC&order_by=sent&include_recipients=true"
                api = api.replace("#account#", account);
                http.url = rootApi + "/" + api;
                http.method = 'GET';
                http.responseType = "json";
                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            destSignEnv: function(envelopeId, dataSend) {
                var deferred = $q.defer();
                var api = "accounts/#account#/envelopes/#envelopeId#/views/recipient"
                api = api.replace("#account#", account);
                api = api.replace("#envelopeId#", envelopeId);
                http.url = rootApi + "/" + api;
                http.method = 'POST';
                http.responseType = "json";
                http.data = dataSend;

                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;

            },
            senderSignEnv: function(envelopeId, dataSend) {
                var deferred = $q.defer();
                var api = "accounts/#account#/envelopes/#envelopeId#/views/sender"
                api = api.replace("#account#", account);
                api = api.replace("#envelopeId#", envelopeId);
                http.url = rootApi + "/" + api;
                http.method = 'POST';
                http.responseType = "json";
                http.data = dataSend;
                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            getdocSigned: function(envelopeId) {
                var deferred = $q.defer();
                var api = "accounts/#account#/envelopes/#envelopeId#/documents/combined?certificate=true&include_metadata=true&language=fr&show_changes=true"
                api = api.replace("#account#", account);
                api = api.replace("#envelopeId#", envelopeId);
                http.url = rootApi + "/" + api;
                http.method = 'GET';
                http.responseType = "blob";
                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            getdocSignedData: function(envelopeId) {
                var deferred = $q.defer();
                var api = "accounts/#account#/envelopes/#envelopeId#/recipients?include_tabs=true"
                api = api.replace("#account#", account);
                api = api.replace("#envelopeId#", envelopeId);
                http.url = rootApi + "/" + api;
                http.method = 'GET';
                http.responseType = "json";
                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;
            },
            getDocEvents: function(envelopeId) {
                var deferred = $q.defer();
                var api = "accounts/#account#/envelopes/#envelopeId#/audit_events"
                api = api.replace("#account#", account);
                api = api.replace("#envelopeId#", envelopeId);
                http.url = rootApi + "/" + api;
                http.method = 'GET';
                http.responseType = "json";
                $http(http)
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });
                return deferred.promise;

 
            }
        };
    })
    .filter('statusCode', function() {
        return function(x) {
            var statusCode = 
                { "created": "crée" ,
                 "deleted": "supprimée" ,
                 "sent": "envoyée" ,
                 "delivered": "livrée" ,
                 "signed": "signée" ,
                 "completed": "terminée" ,
                 "declined": "refusée" ,
                 "voided": "annulée" ,
                 "timedout": "hors délai" ,
                 "authoritativecopy": "copie autorisée" ,
                 "transfercompleted": "transfert terminé",
                 "template": "modèle" ,
                 "correct": "correcte" 
                };
            var text = statusCode[x];
            return text ? text : x;
        }
    })
    .controller('docuSignCtrl', function($rootScope, $scope,$state ,$ionicSideMenuDelegate,$ionicPopup ,$ionicModal, docuSignApi,localDataFactory,menuFactory) {
        //$ionicSideMenuDelegate.canDragContent(false);
        
        $scope.defaultDoc = {"model": "", "email": "doc.gautier@gmail.com", "name": "doc GAUTIER", "msg": "SMA - Document à signer." };
        $scope.doc={};
        $scope.dataEnv = null;
        $scope.docData = null;
        $scope.envId = null;
        $scope.search = { subject: '' };
        $scope.pdfUrl= null;

        var idMenu = 7;
        $rootScope.$on('clientChange', function(event, args) {
            console.log("Event CLIENT CHANGE", event, args);
            $scope.form = null;
            $scope.curCli = args;
            $scope.init();
        });

        // ===== Gestion de la fenetre modale ======
        $ionicModal.fromTemplateUrl('docDetail.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $ionicModal.fromTemplateUrl('docPdf.html', {
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.modalPdf = modal;
        });        
        $scope.closeDetail = function() {
            $scope.modal.hide();
        }
        $scope.closePdf = function() {
            $scope.modalPdf.hide();
        }
        // ===== Affichage des alertes =====
        $scope.showAlert = function(txt) {
            var alertPopup = $ionicPopup.alert({
                title: 'Operation en erreur',
                template: txt
            });
            alertPopup.then(function(res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
        $scope.init = function() {
            //$scope.listTemplates();
            $scope.curCli = localDataFactory.getCurrent();
            console.log("== Current rdv", $scope.curCli);
            if ($scope.curCli.idx === undefined || $scope.curCli.idx === null) {
                var alertPopup = $ionicPopup.alert({
                    title: 'SMAVie Mobilité',
                    template: 'Veuillez selectionner un rdv.'
                });
                alertPopup.then(function (res) { });
                $scope.doc.email=$scope.defaultDoc.email;
                $scope.doc.name=$scope.defaultDoc.name;
                $scope.doc.msg=$scope.defaultDoc.msg;
                $scope.dataEnv = null;
                $scope.docData = null;
                $scope.envId = null;
                $scope.search = { subject: '' };
                $scope.pdfUrl= null;
                $scope.form={"signDoc":"","dataDoc":""};
                console.log($scope.doc);
            } else {
                $scope.doc.email=$scope.curCli.data.EMAIL;
                $scope.doc.name=$scope.curCli.data.NOM;
                $scope.doc.msg=$scope.defaultDoc.msg;
                $scope.dataEnv = null;
                $scope.docData = null;
                $scope.envId = null;
                $scope.search = { subject: '' };
                $scope.pdfUrl= null;
                $scope.form={"signDoc":"","dataDoc":""};
                
            }
        }
        $scope.pendingState = function () {
            menuFactory.setMenu(idMenu, 'Pending');
            $scope.stateMenu = "En attente"
        };
        $scope.holdState = function () {
            menuFactory.setMenu(idMenu, 'Hold');
            $scope.stateMenu = "Suspendue"
        };
        $scope.checkState = function () {
            console.log("=== Data from form", $scope.form);
            $scope.stateMenu = "Terminée";
            localDataFactory.validForm(idMenu, $scope.curCli.idx, angular.copy($scope.form), $scope.stateMenu)
                .then(function(data) {
                    menuFactory.setMenu(idMenu, 'Completed');
                    $scope.stateMenu = "Terminée";
                    menuFactory.goNext(idMenu).then(function(nextMenu) {
                        $state.go(nextMenu);
                    })
                });
        };
        // ===== Actions de signature =====
        $scope.infoAccount = function() {
            docuSignApi.getAccount().then(function(data) {
                console.log(data);
                $scope.dataAccount = data;
            }, function(reason) {
                $scope.showAlert('Failed: ' + JSON.stringify(reason));
            });
        };
        $scope.listTemplates = function() {
            docuSignApi.getTemplates().then(function(data) {
                console.log(data);
                $scope.lstTemplates = data.envelopeTemplates;
            }, function(reason) {
                $scope.showAlert('Failed: ' + JSON.stringify(reason));
            });
            $scope.$broadcast('scroll.refreshComplete');
        };
        $scope.listEnvelopes = function(folder) {
            docuSignApi.getListEnv(2016, 01, folder).then(function(data) {
                console.log(data);
                $scope.lstEnvelopes = data;
            }, function(reason) {
                $scope.showAlert('Failed: ' + JSON.stringify(reason));
            });
            $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.selectEnvelope = function(item) {
            $scope.envId = item.envelopeId;
        };
        $scope.sendSign = function() {
            console.log("DOC", $scope.doc);
            if ($scope.doc.model) {
                $scope.dataEnv = null;
                var dataSend = {
                    "status": "sent",
                    "emailBlurb": "Vous avez un document à signer. Merci de votre confiance.",
                    "emailSubject": $scope.doc.msg,
                    "templateId": $scope.doc.model.templateId,
                    "templateRoles": [
                        { "email": $scope.doc.email, "name": $scope.doc.name, "roleName": "signataire", "clientUserId": "1001" }
                    ]
                };
                docuSignApi.sendSignEnv(dataSend).then(function(data) {
                    console.log(data);
                    $scope.dataEnv = data;
                    $scope.envId = data.envelopeId;
                }, function(reason) {
                    $scope.showAlert('Failed: ' + JSON.stringify(reason));
                });
            }
        };
        $scope.signClient = function(envelopeId) {
            if (envelopeId) {
                var dataSend = {
                    "email": $scope.doc.email,
                    "userName": $scope.doc.name,
                    "returnUrl": "http://gautiersa.fr/vie/docuSignReturn",
                    "authenticationMethod": "email",
                    "clientUserId": "1001"
                }
                docuSignApi.destSignEnv(envelopeId, dataSend).then(function(data) {
                    console.log(data);
                    window.open(data.url, '_system');
                }, function(reason) {
                    $scope.showAlert('Failed: ' + JSON.stringify(reason));
                })
            }
        };
        $scope.signSender = function(envelopeId) {
            if (envelopeId) {
                var dataSend = {};
                docuSignApi.senderSignEnv(envelopeId, dataSend).then(function(data) {
                    console.log(data);
                    window.open(data.url, '_system');
                }, function(reason) {
                    $scope.showAlert('Failed: ' + JSON.stringify(reason));
                })
            }
        };
        $scope.getDocSigned = function(envelopeId) {
            if (envelopeId) {
                var dataSend = {};
                docuSignApi.getdocSigned(envelopeId).then(function(data) {
                    //console.log(data);
                    $scope.loading = 'chargement en cours';
                    var file = new Blob([data], { type: 'application/pdf' });
                    $scope.pdfUrl = URL.createObjectURL(file);
                    $scope.form.signDoc=btoa(data);
                    
                    // test
                   $scope.modalPdf.show();
                    //window.URL.revokeObjectURL($scope.fileURL);
                    //
                    //window.open(fileURL, '_system','location=yes');
                }, function(reason) {
                    $scope.showAlert('Failed: ' + JSON.stringify(reason));
                })
            }
        };
        $scope.onError = function (error) {
            console.log(error);
        };
        $scope.onLoad = function () {
            $scope.loading = '';
        };
        $scope.onProgress = function (progress) {
            //console.log(progress);
        };
        $scope.getDocData = function(envelopeId) {
            if (envelopeId) {
                var dataSend = {};
                docuSignApi.getdocSignedData(envelopeId).then(function(data) {
                    console.log(data);
                    $scope.docData = data;
                    $scope.modal.show();
                    docuSignApi.getDocEvents(envelopeId).then(function(dataEvents) {
                        console.log(dataEvents);
                        $scope.docDataEvents = dataEvents;
                        $scope.form.dataDoc=dataEvents;
                    }, function(reason) {
                        $scope.showAlert('Failed: ' + JSON.stringify(reason));
                    })            
                }, function(reason) {
                    $scope.showAlert('Failed: ' + JSON.stringify(reason));
                })
            }
        };
    });